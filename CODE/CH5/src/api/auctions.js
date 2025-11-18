export async function fetchActiveAuctions() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}auctions/active`)
  if (!res.ok) throw new Error("Failed to fetch active auctions")
  return res.json()
}
