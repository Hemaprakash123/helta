export const protect = async (req, res, next) => {
    try {
        const { userId } = await req.auth();
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Not authenticated" 
            });
        }

        // Attach userId to the request for downstream use
        req.userId = userId;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({ 
            success: false, 
            message: error.message || 'Authentication failed' 
        });
    }
};