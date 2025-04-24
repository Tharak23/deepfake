#include<stdio.h>
#include<stdlib.h>
int main(int argc,char *argv[])
{ 
int i,a[10],sum=0;
int n=atoi(argv[1]);
for(i=2;i<=n+1;i++)
{
	a[i]=atoi(argv[i]);
	sum+=a[i];
}
printf("%d\n",sum);
return 0;
}
