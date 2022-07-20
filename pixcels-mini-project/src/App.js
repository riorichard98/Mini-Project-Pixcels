import './App.css';
import { useQuery, useMutation } from "react-query";
import axios from 'axios';
import PostCard from './components/PostCard';
// import AlignContent from './components/testFlex';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import swal from 'sweetalert'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

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

const query2 = `
mutation (
  $input: CreatePostInput!
) {
  createPost(input: $input) {
    id
    title
    body
  }
}`

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [addTitle, setAddTitle] = React.useState('');

  function addHandler(){
    mutation.mutate()
    handleClose()
  }

  function addModal() {
    return (
      <div>
        <Button
          onClick={handleOpen}
          variant="outlined" style={
            {
              "margin-left": "30px",
              "margin-bottom": "30px",
              "height": "20%"
            }}>Add Post</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add new post
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField
                id="filled-search"
                label="Title"
                variant="filled"
                onChange={(e) => setAddTitle(e.target.value)}
              />
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Button
                onClick={addHandler}
                variant="outlined" style={
                  {
                    "margin-left": "30px",
                    "margin-bottom": "30px",
                    "height": "20%"
                  }}
              >Add Now</Button>
            </Typography>
          </Box>
        </Modal>
      </div>
    )
  }

  const { data, status } = useQuery("users", async () => {
    const { data } = await axios.post('https://graphqlzero.almansi.me/api', {
      query,
      variables: {
        "options": {
          "paginate": {
            "page": 11,
            "limit": 10
          }
        }
      }
    }, {
      "headers": { "content-type": "application/json" }
    })
    return data.data.posts.data
  });

  const mutation = useMutation(async () => {
    return axios.post('https://graphqlzero.almansi.me/api', {
      query:query2,
      variables: {
        "input": {
          "title": addTitle,
          "body": "Some interesting content."
        }
      }
    }, {
      "headers": { "content-type": "application/json" }
    })
  })
  return (
    <div className="App" style={{ "margin-top": "30px" }}>
      {status === "error" && <p>Error fetching data</p>}
      {status === "loading" && <p>Fetching data...</p>}
      {status === "success" && (
        <div style={{
          display: "flex",
          "flex-wrap": " wrap"
        }}>
          {data.map((post) => (
            <PostCard title={post.title} ></PostCard>
          ))}
          {addModal()}
        </div>
      )}
    </div>
  );
}

export default App;
