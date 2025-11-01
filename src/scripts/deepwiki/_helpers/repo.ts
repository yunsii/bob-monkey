export function isRepoPage() {
  const pathname = location.pathname

  if (pathname.startsWith('/search/')) {
    return false
  }
  // Only cache paths like /owner/repo
  if (pathname.split('/').filter(Boolean).length !== 2) {
    return false
  }
  return true
}
