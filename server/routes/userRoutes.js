import express from 'express'
import { discoverUsers, getUserData,followUser, unfollowUser, updateUserData, sendConnectionRequest, acceptConnectionRequest, getUserConnections, getUserProfiles } from '../controllers/userController.js'
import { protect } from '../middlewares/auth.js'
import { upload } from '../configs/multer.js'
import {getUserRecentMessages} from '../controllers/messageController.js'

const userRouter=express.Router()

userRouter.get('/data',protect, getUserData)
userRouter.post('/update',upload.fields([{name:'profile',maxCount:1},{name:'cover',maxCount:1}]), protect,updateUserData)
userRouter.post('/discover',protect, discoverUsers)
userRouter.post('/follow',protect, followUser)
userRouter.post('/unfollow',protect, unfollowUser)
userRouter.post('/connect',protect,sendConnectionRequest)
userRouter.post('/accept',protect,acceptConnectionRequest)
userRouter.get('/connections',protect,getUserConnections)
userRouter.post('/profiles',protect,getUserProfiles,)
userRouter.get('/recent-messages',protect,getUserRecentMessages)

export default userRouter