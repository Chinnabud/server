const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.register = async(req,res)=>{
    try {

        const{ email, password } = req.body
        if(!email){
            //
            return res.status(400).json({ message: 'Email is required!!!'})
        }
        if(!password){
            return res.status(400).json({ message: 'password is required!!!'})
        }

        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(user){
            return res.status(400).json({ message: "Email already exits!!" })
        }

        const hashPassword = await bcrypt.hash(password,10)

        await prisma.user.create({
            data:{
                email : email,
                password: hashPassword
            }
        })

        res.send('Register success')
    } catch (err) {

        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}


exports.login = async(req,res)=>{
    try {
        const { email, password } = req.body

        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })

        if(!user || !user.enabled) {
            return res.status(400).json({ message: "User Not found or not Enabled" })
        }

        const isMatch = await bcrypt.compare(password, user.password)  
        if(!isMatch){
            return res.status(400).json({ message: "Invalid Password" })
        }

        const payload = {
            
                id: user.id,
                email: user.email,
                role: user.role

        }
        jwt.sign(payload,  process.env.SECRET, { expiresIn: '1d' },(err, token)=>{ 
            if(err){
                return res.status(500).json({ message: "Server Error" })

            }
            res.json({ payload, token })
        })
      
        console.log(payload)
        
        console.log(email, password)
        res.send('Hello Login In Controller')
    } catch (err) {

        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
exports.currentUser = async(req,res)=>{
    try {

        res.send('Hello current user')
    } catch (err) {

        console.log(err)
        res.status(500).json({ message: "Server Error" })
    }
}
