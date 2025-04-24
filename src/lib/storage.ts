'use server';

import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import dbConnect from './mongoose';
import File from '@/models/File';
import User from '@/models/User';

// Local storage path (for development)
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

// Generate a unique filename
export async function generateUniqueFilename(originalFilename: string) {
  const ext = path.extname(originalFilename);
  const name = path.basename(originalFilename, ext);
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  return `${name}-${timestamp}-${uuid}${ext}`;
}

// Get file path based on type
export async function getFilePath(type: string, filename: string, userId: string) {
  return `${type}/${userId}/${filename}`;
}

// Upload a file
export async function uploadFile(
  file: File,
  type: string,
  userId: string,
  metadata: Record<string, any> = {}
) {
  console.log('Starting file upload process...');
  
  // Validate inputs
  if (!file) {
    throw new Error('File is required');
  }
  
  if (!type) {
    throw new Error('File type is required');
  }
  
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  // Check if file has required properties
  if (!file.name || !file.size) {
    console.error('Invalid file object:', { 
      hasName: !!file.name, 
      hasSize: !!file.size 
    });
    throw new Error('Invalid file object: missing required properties');
  }
  
  console.log('Ensuring upload directory exists...');
  try {
    await ensureUploadDir();
  } catch (error) {
    console.error('Failed to create upload directory:', error);
    throw new Error('Failed to create upload directory: ' + (error instanceof Error ? error.message : String(error)));
  }
  
  let uniqueFilename;
  try {
    uniqueFilename = await generateUniqueFilename(file.name);
    console.log('Generated unique filename:', uniqueFilename);
  } catch (error) {
    console.error('Failed to generate unique filename:', error);
    throw new Error('Failed to generate filename: ' + (error instanceof Error ? error.message : String(error)));
  }
  
  const relativePath = await getFilePath(type, uniqueFilename, userId);
  const fullPath = join(UPLOAD_DIR, relativePath);
  
  console.log('File will be saved to:', fullPath);
  
  // Ensure directory exists
  try {
    await mkdir(path.dirname(fullPath), { recursive: true });
    console.log('Directory created:', path.dirname(fullPath));
  } catch (dirError) {
    console.error('Failed to create directory:', dirError);
    throw new Error('Failed to create directory: ' + (dirError instanceof Error ? dirError.message : String(dirError)));
  }
  
  // Write file to disk
  try {
    console.log('Converting file to buffer...');
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log('Writing file to disk...', {
      fileSize: buffer.length,
      path: fullPath
    });
    await writeFile(fullPath, buffer);
    console.log('File written successfully');
  } catch (fileError) {
    console.error('Failed to write file to disk:', fileError);
    throw new Error('Failed to write file to disk: ' + (fileError instanceof Error ? fileError.message : String(fileError)));
  }
  
  // Create file record in database
  let fileDoc;
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Creating file record in database...');
    fileDoc = await File.create({
      name: uniqueFilename,
      originalName: file.name,
      path: relativePath,
      url: `/uploads/${relativePath}`,
      type: type,
      mimeType: file.type || 'application/octet-stream',
      size: file.size,
      userId,
      title: metadata.title || file.name,
      description: metadata.description || '',
      tags: metadata.tags || [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('File record created:', fileDoc._id);
  } catch (dbError) {
    console.error('Database error while creating file record:', dbError);
    throw new Error('Failed to create file record in database: ' + (dbError instanceof Error ? dbError.message : String(dbError)));
  }
  
  // Update user's contributions if applicable
  try {
    if (['papers', 'datasets', 'experiments', 'images'].includes(type)) {
      console.log('Updating user contributions...');
      await User.findByIdAndUpdate(
        userId,
        { $push: { [`contributions.${type}`]: fileDoc._id } },
        { new: true }
      );
      console.log('User contributions updated');
    }
  } catch (userError) {
    console.error('Error updating user contributions (non-fatal):', userError);
    // Don't fail the whole upload if just the user record update fails
  }
  
  console.log('File upload process completed successfully');
  // Return public URL and file details
  return {
    id: fileDoc._id.toString(),
    name: uniqueFilename,
    originalName: file.name,
    url: `/uploads/${relativePath}`,
    type: type,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    title: metadata.title || file.name,
    description: metadata.description || '',
    createdAt: fileDoc.createdAt,
    isPrivate: metadata.isPrivate || false
  };
}

// Delete a file
export async function deleteFile(fileId: string) {
  await dbConnect();
  
  // Find file in database
  const fileDoc = await File.findById(fileId);
  if (!fileDoc) {
    throw new Error('File not found');
  }
  
  // Delete file from disk
  const fullPath = join(UPLOAD_DIR, fileDoc.path);
  try {
    await unlink(fullPath);
  } catch (error) {
    console.error('Error deleting file from disk:', error);
  }
  
  // Remove file from user's contributions
  if (fileDoc.userId && ['papers', 'datasets', 'experiments', 'images'].includes(fileDoc.type)) {
    await User.findByIdAndUpdate(
      fileDoc.userId,
      { $pull: { [`contributions.${fileDoc.type}`]: fileDoc._id } }
    );
  }
  
  // Delete file record from database
  await File.findByIdAndDelete(fileId);
  
  return { success: true };
}

// Get file URL
export async function getFileUrl(relativePath: string) {
  return `/uploads/${relativePath}`;
}

// List files
export async function listFiles(userId: string, type?: string) {
  await dbConnect();
  
  const query: any = { userId };
  if (type) {
    query.type = type;
  }
  
  const files = await File.find(query).sort({ createdAt: -1 });
  
  // Process files one by one to handle async operations
  const result = [];
  for (const file of files) {
    result.push({
      id: file._id.toString(),
      name: file.name,
      originalName: file.originalName,
      url: file.url || await getFileUrl(file.path),
      type: file.type,
      size: file.size,
      title: file.title,
      description: file.description,
      tags: file.tags,
      views: file.views,
      downloads: file.downloads,
      uploadedAt: file.createdAt
    });
  }
  
  return result;
}

// Get file by ID
export async function getFileById(fileId: string) {
  await dbConnect();
  
  const file = await File.findById(fileId);
  if (!file) {
    throw new Error('File not found');
  }
  
  // Increment views
  await File.findByIdAndUpdate(fileId, { $inc: { views: 1 } });
  
  return {
    id: file._id.toString(),
    name: file.name,
    originalName: file.originalName,
    url: file.url || await getFileUrl(file.path),
    type: file.type,
    size: file.size,
    title: file.title,
    description: file.description,
    tags: file.tags,
    views: file.views,
    downloads: file.downloads,
    userId: file.userId,
    createdAt: file.createdAt
  };
}

// Download file (increment download counter)
export async function downloadFile(fileId: string) {
  await dbConnect();
  
  const file = await File.findById(fileId);
  if (!file) {
    throw new Error('File not found');
  }
  
  // Increment downloads
  await File.findByIdAndUpdate(fileId, { $inc: { downloads: 1 } });
  
  return {
    url: file.url || await getFileUrl(file.path),
    name: file.originalName
  };
} 