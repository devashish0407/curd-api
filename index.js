const express= require('express');
const app= express();
const PORT=3000;

app.get('/', (req,res) => {
    res.send('Hello, Server !');
});

app.listen(PORT, () =>{
    console.log(`Server Running http://localhost:${PORT}`);
});