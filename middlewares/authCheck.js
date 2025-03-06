const { Prisma } = require('@prisma/client')
const e = require('express')
const jwt = require('jsonwebtoken')

exports.authCheck = async (req, res, next) => {
    try {
        const headerToken = req.headers.authorization
        if (!headerToken) {
            return res.status(401).json({ message: 'No Token Authorization' })
        }
        const token = headerToken.split(' ')[1]



       const decode= jwt.verify(token, process.env.SECRET, )
        req.user = decode


            const user = await Prisma.user.findUnique({
                where: {
                    email: req.user.email
                }
            })
            if (user.enable) {
                return res.status(400).json({ message: 'this account cannot access' })
            }
            console.log(user)  
            console.log('hello middleware')   

            next() 
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Token invalid' })
    }
}

exports.adminCheck = async (req, res, next) => {
    try {
        const { email } = req.user
        const adminUser = await Prisma.user.findfirst({
            where: {email: email }
                
           
        })
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: ' access denied: ADmin' })
        }

        console.log('admin check',email)
        next()
    }catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error Admin access denied' })
    }
}