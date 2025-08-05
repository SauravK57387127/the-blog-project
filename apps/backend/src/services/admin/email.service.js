import { asyncHandler } from "../../utils/asyncHandler";


export default {
    sendEmailToAdmin: asyncHandler( async (blog) => {
        return "new blog published by you!!"
    }),

    sendEmailToUsers: asyncHandler( async (blog) => {
        return "sent mail to users"
    })
}