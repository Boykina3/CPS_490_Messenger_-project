import { useQuery } from '@tanstack/react-query'
import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { getPosts } from '../api/posts.js'
import { fetchActiveAuctions } from '../api/auctions.js'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { Link } from 'react-router-dom'
import '../css/auctions.css'


export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  
  const postsQuery = useQuery({
  queryKey: ['posts', { author, sortBy, sortOrder }],
  queryFn: () => getPosts({ author, sortBy, sortOrder }),
})

  const posts = postsQuery.data ?? []

  const auctionsQuery = useQuery({
    queryKey: ['active-auctions'],
    queryFn: fetchActiveAuctions,
    refetchInterval: 30000, 
  })
  
  const activeAuctions = auctionsQuery.data ?? []

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <br />
      <br />
      
      <h2>Active Auctions</h2>
      {auctionsQuery.isLoading && <p>Loading auctions...</p>}
      {auctionsQuery.error && <p>Error loading auctions.</p>}
      {activeAuctions.length === 0 && <p>No active auctions found.</p>}

      <div className="auction-grid">
  {activeAuctions.map(a => (
    <Link to={`/auctions/${a._id}`} key={a._id} style={{ textDecoration: 'none' }}>
      <article className="auction-card">
        <h3>{a.title}</h3>
        <p>{a.description}</p>
        <div className="auction-info">
          <strong>Current Bid:</strong> {a.currentBid} tokens<br />
          <strong>Ends:</strong> {new Date(a.endTime).toLocaleString()}
        </div>
      </article>
    </Link>
  ))}
</div>

      <hr />
      <CreatePost />
      <br />
      <hr />
      Filter By:
      <PostFilter
        field='author'
        value={author}
        onChange={(value) => setAuthor(value)}
      />
      <br />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <PostList posts={posts} />
    </div>
  )
}