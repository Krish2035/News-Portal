import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from "bcryptjs"

export const updateUser = async(req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, "You can only update your own account!"))
    }

    if(req.body.password){
        if(req.body.password.length < 8){
            return next(errorHandler(400, "Password must be atleast 8 characters long"))
        }

        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

    if (req.body.username) {
      if (req.body.username.length < 8 || req.body.username.length > 20) {
        return next(
          errorHandler(400, "Password must be between 8 and 20 characters"),
        )
      }

      if(req.body.username.includes(" ")){
        return next(errorHandler(400, "Username can not contain spaces"))
      }

      if (req.body.username !== req.body.username.toLowerCase()) {
        req.body.username = req.body.username.toLowerCase()
      }

      if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
        return next(errorHandler(400, "Username can only contains letters and numbers"))
      }
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
          req.params.userId,
          {
            $set: {
              username: req.body.username,
              email: req.body.email,
              profilePicture: req.body.profilePicture,
              password: req.body.password,
            },
          },
          { returnDocument: "after" },
        );

    const {password: pass, ...rest} = updatedUser._doc

    res.status(200).json(rest)
    }catch (error) {
        next(error)
    }
}