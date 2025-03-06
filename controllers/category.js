exports.create = async(req,res)=>{
    try{

        const { name } = req.body
        const category = await prisma.category.create({
            data:{
                name: name
            }
        })

        res.send('Category')
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
exports.list = async(req,res)=>{
    try{
        const categories = await prisma.category.findMany()
        res.send('Hello Category list')
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
exports.remove = async(req,res)=>{
    try{

        const { id } = req.params
        const category = await prisma.category.delete({
            where:{
                id: Number(id)
            }
        })
        res.send('Category')
    }catch(err){
        console.log(err)
        res.status(500).json({ message : "Server error" })
    }
}
