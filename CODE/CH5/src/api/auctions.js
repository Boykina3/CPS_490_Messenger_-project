const API_URL = import.meta.env.VITE_BACKEND_URL

export async function fetchActiveAuctions() {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}auctions/active`)
  if (!res.ok) throw new Error("Failed to fetch active auctions")
  return res.json()
}

export async function getAuction(id) {
  const res = await fetch(`${API_URL}auctions/${id}`)
  if (!res.ok) throw new Error("Failed to fetch auction")
  return await res.json()
}

export async function createAuction(token, auctionData) {
  const res = await fetch(`${API_URL}auctions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(auctionData)
  })
  if (!res.ok) throw new Error("Failed to create auction")
  return await res.json()
}

export async function placeBid(token, auctionId, amount) {
  const res = await fetch(`${API_URL}auctions/${auctionId}/bid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount })
  })
  if (!res.ok) throw new Error(await res.text())
  return await res.json()
}

export async function getBidHistory(auctionId) {
  const res = await fetch(`${API_URL}auctions/${auctionId}/bids`)
  if (!res.ok) throw new Error("Failed to fetch bid history")
  return await res.json()
}