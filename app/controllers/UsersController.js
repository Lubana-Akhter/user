import UsersModel from "../models/UsersModel.js";
import { TokenEncode } from "../utility/tokenUtility.js";

export const Registration = async (req, res) => {
    try {
        let reqBody = req.body;
        await UsersModel.create(reqBody)
        return res.json({ status: "success", "Message": "User registered successfully" })
    } catch (err) {
        return res.json({ status: "fail", "Message": err.toString() })
    }
}


export const Login = async (req, res) => {
    try {
        let reqBody = req.body;
        let data = await UsersModel.findOne(reqBody);

        if (data === null) {
            return res.json({ status: "fail", Message: "User not found" });
        } else {
            // Login Success - Token Encode
            let token = TokenEncode(data['email'], data['_id']);

            // Set the token as an HTTP-only cookie
            res.cookie('authToken', token, {
                httpOnly: true, // Prevents JavaScript access to the cookie
                secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
                sameSite: "strict", // Prevents CSRF attacks
                maxAge: 24 * 60 * 60 * 1000 // Token valid for 1 day
            });

            return res.json({
                status: "success",
                Token: token,
                Message: "User Login successfully"
            });
        }
    } catch (err) {
        return res.json({ status: "fail", Message: err.toString() });
    }
};
export const GetAllUsers = async (req, res) => {
    try {
        // Fetch all users
        const users = await UsersModel.find();

        // Check if any users are found
        if (users.length === 0) {
            return res.json({ status: "success", Message: "No users found", data: [] });
        }

        return res.json({ status: "success", data: users });
    } catch (err) {
        return res.status(500).json({ status: "fail", Message: err.toString() });
    }
};

export const ProfileDetails = async (req, res) => {
    try {
        let user_id = req.headers['user_id'];
        let data = await UsersModel.findOne({ "_id": user_id })
        return res.json({ status: "success", "Message": "User ProfileDetails successfully", data: data })
    }
    catch (err) {
        return res.json({ status: "fail", "Message": err.toString() })
    }
}

export const ProfileUpdate = async (req, res) => {

    try {
        let reqBody = req.body;
        let user_id = req.headers['user_id'];
        await UsersModel.updateOne({ "_id": user_id }, reqBody);

        return res.json({ status: "success", "Message": "User Profile Update successfully" })

    } catch (err) {
        return res.json({ status: "fail", "Message": err.toString() })
    }

}

export const DeleteUserById = async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await UsersModel.findByIdAndDelete(userId);

        if (!result) {
            return res.status(404).json({ status: "fail", Message: "User not found" });
        }

        return res.json({ status: "success", Message: "User deleted successfully", data: result });
    } catch (err) {
        return res.status(500).json({ status: "fail", Message: err.toString() });
    }
};
