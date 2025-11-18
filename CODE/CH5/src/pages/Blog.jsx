import { useQuery } from '@tanstack/react-query'
import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { getPosts } from '../api/posts.js'
import { useState } from 'react'
import { Header } from '../components/Header.jsx'
import { fetchActiveAuctions } from '../api/auctions.js'

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
      <CreatePost />
      <br />
      <hr />
       <h2>Active Auctions</h2>

      {auctionsQuery.isLoading && <p>Loading auctions...</p>}
      {auctionsQuery.error && <p>Error loading auctions.</p>}

      {activeAuctions.length === 0 && <p>No active auctions found.</p>}

      <ul>
        {activeAuctions.map(a => (
          <li key={a._id} style={{ marginBottom: 12 }}>
            <strong>{a.title}</strong><br />
            {a.description}<br />
            Ends: {new Date(a.endTime).toLocaleString()}
          </li>
        ))}
      </ul>

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

