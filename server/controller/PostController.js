const PostModel = require("../model/PostModel");

module.exports.createPost = async (req, res) => {
    const { title, content, posterUserId, posterUsername } = req.body;
    const newPost = new PostModel({
        title,
        content,
        posterUserId,
        posterUsername
    });
    try {
        const result = await newPost.save();
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports.findPost = async (req, res) => {
    const { postId } = req.params;
    try {
        const resultPost = await PostModel.findOne({ _id: postId });
        if (resultPost) {
            res.status(200).json(resultPost);
        } else {
            res.status(404).json({ message: "Post not found" });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports.deletePost = async (req, res) => {
    const { postId } = req.params;
    try {
        await PostModel.findByIdAndDelete(postId);
        res.status(200).json("DELETED");
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports.fetchPosts = async (req, res) => {
    try {
        const allPosts = await PostModel.find();
        res.status(200).json(allPosts);
    } catch (error) {
        res.status(500).json(error);
    }
};
