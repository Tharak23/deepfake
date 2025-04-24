<select
  value={category}
  onChange={handleCategoryChange}
  className="bg-[var(--card-bg)] border border-[var(--border)] rounded-md text-sm px-2 py-1"
  aria-label="Leaderboard category"
  suppressHydrationWarning
>
  {/* ... options ... */}
</select>

<button
  className="p-1 text-gray-400 hover:text-white transition-colors duration-200"
  aria-label="More options"
  suppressHydrationWarning
>
  <FiMoreVertical size={16} />
</button>

<button
  className="text-[var(--primary)] hover:text-[var(--secondary)] text-sm transition-colors duration-200 flex items-center"
  onClick={handleViewFullRankings}
  suppressHydrationWarning
>
  View Full Rankings
  <FiChevronRight className="ml-1" size={14} />
</button> 