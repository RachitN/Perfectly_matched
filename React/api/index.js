const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Sample route
app.post('/api/data', async (req, res) => {
  try {
    const {id}  = req.body
      const result = await pool.query(`SELECT u.*, 
       CASE 
           WHEN m.isMatch IS NOT NULL THEN m.isMatch 
           ELSE NULL 
       END AS isMatch
FROM users u
JOIN connection c ON u.id = ANY(c.ids)
LEFT JOIN match m 
    ON m.selfid = $1
    AND m.matchid = u.id
WHERE c.id = $1;`, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// app.post('/api')

app.post('/api/signUp', async (req, res) => {
    try {
      const {email,mobile,password,dob,bio,location,interests,name,gender} = req.body;
      const result = await pool.query('INSERT INTO users (email, mobile,password,dob,bio,location,interests,name,gender) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',[email,mobile,password,dob,bio,location,interests,name,gender]);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

app.post('/api/bulkInsert',async(req,res)=>{
    try{
        const data = req.body;
        const values = data.map(row => Object.values(row))
        const columns = Object.keys(data[0]).join(', ');
        const valuePlaceholders = data
        .map(
          (_, index) =>
            `(${Object.keys(data[0])
              .map((_, idx) => `$${index * Object.keys(data[0]).length + idx + 1}`)
              .join(', ')})`
        )
        .join(', ');
        const queryText = `INSERT INTO users (${columns}) VALUES ${valuePlaceholders} RETURNING *`;
        const result = await pool.query(queryText, values.flat());
        res.json(result.rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
})

app.post('/api/login',async(req,res)=> {
    let loginKey = null;
    try {
        const { email, password } = req.body;

        // Fetch user by email and password
        const userResult = await pool.query(
            'SELECT id, password FROM users WHERE email = $1',
            [email]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Wrong User Name or Password", token: false });
        }

        const user = userResult.rows[0];

        // If passwords are hashed, use bcrypt to compare
        const passwordMatch = password == user.password; // Only if passwords are hashed
        if (!passwordMatch) {
            return res.status(401).json({ message: "Wrong User Name or Password", token: false });
        }

        // If login is successful, generate login key
        const loginId = user.id;
        loginKey = await pool.query('SELECT md5(random()::text || clock_timestamp()::text)::uuid');
        const generatedKey = loginKey.rows[0]?.md5;

        // Insert login details into login_user table
        await pool.query(
            'INSERT INTO login_user (login_key, login_id, timestamp) VALUES ($1, $2, $3)',
            [generatedKey, loginId, new Date()]
        );

        return res.json({
            message: "Login Successful",
            token: generatedKey,
        });

    } catch (err) {
        console.error("Server Error:", err.message);
        return res.status(500).json({ message: 'Server Error' });
    }})

 const getRecords = async (id)=>{
               // Fetch 5 random user IDs
        const selectedgender = await pool.query('SELECT gender FROM users WHERE id = $1', [id]);
       const add = await pool.query('SELECT id FROM users WHERE id != $1 and gender !=$2  ORDER BY RANDOM() LIMIT 5',[id, selectedgender.rows[0].gender]);
   
       // Extract the ids from the result and convert them to an array
       const idsArray = add.rows.map(row => row.id);

       return idsArray
}
app.post('/api/collectUsers', async (req, res) => {
    try {
        const { token } = req.body;
        let idResult = await pool.query('SELECT login_id FROM login_user WHERE login_key = $1', [token]);
        const id = idResult.rows[0].login_id;

        const refreshKey = 'default refresh time';
        let refreshTimeResult = await pool.query('SELECT value FROM configuaration WHERE key = $1', [refreshKey]);
        const refreshTime = 86400000 * refreshTimeResult.rows[0].value;

        const timestampResult = await pool.query('SELECT timestamp FROM connection WHERE id = $1', [id]);
        let isRefresh = true;

        if (timestampResult.rows.length > 0) {
            isRefresh = (new Date().getTime() - timestampResult.rows[0].timestamp.getTime()) > refreshTime;
        }

        if (isRefresh) {
            await pool.query('DELETE FROM connection WHERE id = $1', [id]);
            const idsArray = await getRecords(id);
            await pool.query('INSERT INTO connection (id, ids, timestamp) VALUES ($1, $2, Now()) RETURNING *', [id, idsArray]);
            res.json({ result: 'updated' });
        } else {
            await pool.query('SELECT * FROM connection WHERE id = $1', [id]);
            res.json({ result: 'existing' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
)

app.post('/api/getmessages', async(req,res)=>{
    const {userId, reciepentId} = req.body;
    try{
        const messages = await pool.query("select * from message where (sender_id = $1 and reciever_id = $2) or (sender_id = $2 and reciever_id = $1) order by timestamp Asc", [userId,reciepentId])
        res.json(messages.rows);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

app.post('/api/messages', async(req,res)=>{
    const {userId, reciepentId,message} = req.body;
    try {
        const sendMessage = await pool.query('Insert into message (sender_id, reciever_id, message, timestamp) Values ($1,$2,$3,Now())',[userId,reciepentId,message])
        res.json(sendMessage.rows[0])
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

app.post('/api/match',async(req,res)=>{
    let {selfid, matchid} = req.body;
    try{
        console.log(matchid)
        const selfQuery = await pool.query("INSERT INTO match (selfid,matchid,ismatch) Values ($1,$2,true)",[selfid,matchid])
        const matchQuery = await pool.query("INSERT INTO match (selfid,matchid,ismatch) Values ($1,$2,false)",[matchid,selfid])
        res.json(matchQuery.rows)
    }catch(err){
        console.error(err.message);
        res.status(500).send(err.message)
    }
})

app.post('/api/accept', async(req,res)=>{
    let {selfid,matchid} = req.body;
    try{
        const acceptQuery = await pool.query('update match set ismatch = true where selfid = $1 and matchid = $2',[selfid,matchid])
        res.json(acceptQuery.rows)
    }
    catch(err){
        console.error(err.message);
        res.status(500).send(err.message)
    }
})

app.post('/api/getmatch',async(req,res)=>{
    let {id} = req.body
    try{
        const result = await pool.query(`SELECT u.* , c.isMatch  FROM users u JOIN match c ON u.id = c.matchid WHERE c.selfid = $1 ORDER BY c.matchid DESC;`, [id]);
        res.json(result.rows)
    }catch(err){
        console.error(err.message);
        res.status(500).send(err.message)
    }
})

app.get('/api/config',async(req,res)=>{
    try{
        const configQuery = await pool.query("select * from configuaration");
        res.json(configQuery.rows)
    }catch(err){
        console.error(err.message);
        res.status(500).send(err.message)
    }
})

app.post('/api/checkmatch', async (req, res) => {

    const { selfid, matchid } = req.body;
    try {
        const checkQuery = await pool.query(`SELECT m1.ismatch AS selfmatch, m2.ismatch AS othermatch
                                            FROM match m1
                                            JOIN match m2 ON m1.selfid = m2.matchid AND m1.matchid = m2.selfid
                                            WHERE m1.selfid = $1 AND m1.matchid = $2;`, [selfid, matchid]);

        res.json(checkQuery.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send(err.message)
    }
})

app.post('/api/token', async (req, res) => {
    const { token } = req.body
    const login_key = token
    const login_time = 'login_time'
    try {
        let refreshTime = await pool.query('select value from configuaration where key = $1', [login_time])
        const login_id = await pool.query('Select * from login_user where login_key = $1', [login_key])
        console.log(login_id.rows + '1')
        if (login_id.rows.length == 0) {
            res.json({
                login: false,
            })
            return;
        }
        else if ((new Date().getTime() - login_id.rows[0].timestamp.getTime()) > (refreshTime.rows[0].value * 3600000)) {
            res.json({
                login: false,
            })
        }
        else {
            res.json({
                login: true,
                login_id: login_id.rows[0].login_id
            })
        }
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send(err.message)
    }
})

app.post('/api/logout', async(req,res)=>{
    const {token} = req.body
    try{
    await pool.query("delete from login_user where login_key = $1", [token])
    res.json({})
    }
    catch(err){
        console.error(err.message);
        res.status(500).send(err.message)
    }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
