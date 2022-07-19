import './App.css';
import { useQuery } from "react-query";
import axios from 'axios';
import PostCard from './components/PostCard';
// import AlignContent from './components/testFlex';
import Box from '@mui/material/Box';

const query = `query(
  $options: PageQueryOptions
) {
  posts(options: $options) {
    data {
      id
      title
    }
    meta {
      totalCount
    }
  }
}
`

function App() {
  const { data, status } = useQuery("users", async () => {
    const { data } = await axios.post('https://graphqlzero.almansi.me/api', {
      query,
      variables: {
        "options": {
          "paginate": {
            "page": 1,
            "limit": 10
          }
        }
      }
    }, {
      "headers": { "content-type": "application/json" }
    })
    return data.data.posts.data
  });
  return (
    <div className="App">
      {status === "error" && <p>Error fetching data</p>}
      {status === "loading" && <p>Fetching data...</p>}
      {status === "success" && (
        <div style={{
          display: "flex",
          "flex-wrap":" wrap"
        }}>
          {data.map((post) => (
            <PostCard></PostCard>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
