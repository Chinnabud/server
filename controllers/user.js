exports.listUsers = async (req, res) => {
    try {
     }  catch (error) {
        res.send('hello users')
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
exports.changeStatus = async (req, res) => {
    try {
     }  catch (error) {
        res.send('hello changeStatus')
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}
exports.changeRole = async (req, res) => {
    try {
     }  catch (error) {
        res.send('hello changeRole')
        console.log(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

