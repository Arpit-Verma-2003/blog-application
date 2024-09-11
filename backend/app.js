const express = require('express')
const multer  = require('multer')
const cors = require('cors');
const flash = require("express-flash");
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const pgSession = require('connect-pg-simple')(session);
const bcrypt = require("bcrypt");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`)
  }
})
const upload = multer({ storage: storage })
const client = require('./db/connection');
const queries = require("./db/queries");
const bodyParser = require('body-parser');
const app = express()
const port = 3000

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173"],
  methods: ["POST","GET","DELETE","PUT"],
  credentials: true 
}));
app.use('/uploads',express.static('uploads'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(flash());
app.use(session({
  secret:'secret',
  resave:false,
  saveUninitialized:true,
  cookie:{
    secure:false,
    maxAge: 1000*60*60*24
  }
}))
app.get('/', (req, res) => {
  res.send('Helloadf Wordlad')
})

app.get('/checkLogin',async (req,res)=>{
      if(req.session.user)  return res.json({"valid":true,"role":req.session.user.role});
      else return res.json({"valid":false,});
})

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', error: err });
    }
    res.clearCookie('connect.sid'); // Clear the cookie stored in the user's browser
    return res.status(200).json({ message: 'Logout successful' });
  });
});

app.get('/blogs/:cat',async (req,res)=>{
  console.log(req.session.user);
    const result = await client.query(
      req.params.cat !='all' ? `SELECT * FROM blogs WHERE category = '${req.params.cat}'`:queries.getBlogs);
      if(req.session.user)  return res.json({"data":result.rows,"valid":true});
      else{
        return res.json({"data":result.rows,"valid":false});
      }
})

app.get('/blogsbyid/:id',async (req,res)=>{
  const id = req.params.id;
  const result = await client.query(queries.getBlogsById,[id]);
  return res.json({"data":result.rows});
})

app.get('/author/blogs', async (req, res) => {
  if(req.session.user){
    const userId = req.session.user.id;
    const result = await client.query(queries.getBlogsByAuthorId, [userId]);
    return res.json({ valid: true, data: result.rows });
  }
});

app.post('/blogs',async (req,res)=>{
  const {author,title,image,post,category} = req.body;
  const result = await client.query(queries.addBlogs,[author,title,image,post,category,req.session.user.id]);
  return res.json({"data":result.rowCount});
})
app.post('/blogsimage', upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  res.json(req.file);
})

app.delete('/api/blogs/:id', async (req, res) => {
  const blogId = req.params.id;
  const userId = req.session.user.id; 
    const result = await client.query('DELETE FROM blogs WHERE id = $1 AND author_id = $2 RETURNING *', [blogId, userId]);
    if (result.rows.length > 0) {
      res.json({ valid: true, message: "Blog deleted" });
    } else {
      res.status(403).json({ valid: false, message: "Unauthorized" });
    } 
});


app.post('/api/register',async (req,res)=>{
  const {username,email,password,confirm_password,role} = req.body;
  try {
    const roleResult = await client.query(queries.findUserByRole, [role]);
    if (password.length < 4) {
      return res.status(400).json({ message: "Password should have 4 minimum characters" });
    }
    if (password != confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const emailExists = await client.query(queries.findUserByEmail,[email]);
    if(emailExists.rowCount>0) return res.status(400).json({ message: "Email Already Exists" });
    const usernameExists = await client.query(queries.findUserByUsername,[username]);
    if(usernameExists.rowCount>0) return res.status(400).json({ message: "Username Already Exists" });
    const roleId = roleResult.rows[0].id;
    let hashedPassword = await bcrypt.hash(password, 10);
    await client.query(queries.addUser,[username,email,hashedPassword,roleId]);
    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user.' });
  }
})
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await client.query(queries.findUserByEmail, [email]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role_id
    };
    userConst = req.session.user;
    console.log(req.session.user);
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
      }
      return res.status(200).json({ message: "Login successful", userDetails: req.session.user });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})