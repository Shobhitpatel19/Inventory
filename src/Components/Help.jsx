import React, { useState } from "react";
import {
    Card,
    CardActionArea,
    Typography,
    CardHeader,
    CardContent,
    Tabs,
    Tab,
    Dialog,
    DialogContent,
    IconButton,
    Grid,
} from "@mui/material";
import CardMedia from '@mui/material/CardMedia';
import CloseIcon from "@mui/icons-material/Close";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

function Help() {
    const [playing, setPlaying] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState("");
    const [value, setValue] = useState(0);

    const handleVideoClick = (videoSrc) => {
        setSelectedVideo(videoSrc);
        setOpen(true);
        setPlaying(true);
    };

    const handleClose = () => {
        setOpen(false);
        setPlaying(false);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const videos = [
        {
            title: "Introduction",
            description: "Introduction And Overview",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common/pos-help/intro-and-overview.mp4"
        },
        {
            title: "Category and Varieties",
            description: "How to Create Categories And Varieties",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common-media-dl/category_and_variety.mp4"
        },
        {
            title: "Add on Category",
            description: "Creating Addons Category And its Items",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common/pos-help/Two-2-create-add-on-categories-and-item.mp4"
        },
        {
            title: "Creating Items",
            description: "Creating Items / Products",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common/pos-help/Three-creating-items-with-varieties-and-add-ons.mp4"
        },
        {
            title: "Manage Order",
            description: "How to Manage Order",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common/pos-help/Five-Manage-orders.mp4"
        },
        {
            title: "Staff Login",
            description: "Responsive Member Login",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common/pos-help/Four-1-how-to-login-to-pos-using-tablet-and-mobile.mp4"
        },
        {
            title: "Dine In Order",
            description: "How to Order For Dine In",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common/pos-help/Four-2-how-to-place-order-for-dine-in-using-admin.mp4"
        },
        {
            title: "Delivery Order",
            description: "How to Order For Delivery",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common/pos-help/Four-3-how-to-place-order-for-delivery.mp4"
        },
        {
            title: "Reports",
            description: "Reports Section with Download Feature",
            src: "https://signage-common-assets.s3.ap-south-1.amazonaws.com/common/pos-help/Six-Reports.mp4"
        },
    ];

    return (
        <div>
        <div className="header">
            <Typography variant="h4" align="left" style={{ marginBottom: "10px", padding:"15px" }}>
                Help Section
            </Typography>
        </div>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="Video Guide" />
                {false && <Tab label="User Guide" />}
                <Tab label="FAQs" />
            </Tabs>

            {value === 0 && (
                <Grid container spacing={2} style={{ padding: 25,height: 'calc(100vh - 200px)',
    overflow:'hidden',
    overflowY:'auto',
    marginTop:'20px' }}>
                    {videos.map((video, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Card
                                raised={true}
                                sx={{
                                    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                }}
                            >
                                <CardActionArea onClick={() => handleVideoClick(video.src)}>
                                    <CardHeader
                                        titleTypographyProps={{ align: 'center', fontWeight: 'bold' }}
                                        title={video.title}
                                    />
                                    <PlayCircleOutlineIcon style={{position:"absolute", top:"20px", left:"10px"}} />
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" component="p" align="center">
                                            {video.description}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogContent>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <CardMedia
                        component="video"
                        src={selectedVideo}
                        controls={playing}
                        autoPlay={playing}
                        loop={playing}
                        muted={playing}
                        style={{ width: "100%" }}
                    />
                </DialogContent>
            </Dialog>

            {value === -1 && (
                <div>
                    <Typography variant="h6" style={{ marginTop: "16px" }}>
                        User Guide Content Here
                    </Typography>
                </div>
            )}

            {value === 1 && (
                <div style={{margin:"0px 20px", padding:"10px 20px",borderRadius:"5px",background:"#fff"}}>
                    <Typography variant="h6" style={{ marginTop: "16px" }}>
                        <h5>1. What are the key features offered by Our Smart Software?</h5>
                        <p> Ans: Our Smart Software offers features like digital menu display, order management, inventory tracking, KOT printing, billing, reporting, and staff management..
                        </p>

                        <h5>2. Can i add variety prices for any item</h5>
                        <p> Ans: Yes, You can add prices multiple as per size</p>

                        <h5>3. Can i have add-on items and groups.</h5>
                        <p> Ans: Yes, it support add-on items and groups. you need to link add-on groups with items</p>

                        <h5>4.  Does Our Smart Software support digital menu displays?</h5>
                        <p> Ans: Yes, Our Smart Software allows restaurants to create and update digital menus in real-time, which can be displayed on tablets or screens.</p>

                        <h5>5. Can I integrate online orders with Our Smart Software?</h5>
                        <p> Ans: Yes, Our Smart Software supports integration with online food delivery platforms and also allows you to manage direct online orders from your website or app.</p>
                    
                        <h5>6. Is Our Smart Software cloud-based?</h5>
                        <p> Ans: Yes, Our Smart Software is a cloud-based POS system, which means you can access your restaurant's data from anywhere, anytime.</p>

                        <h5>7. Does Our Smart Software support KOT (Kitchen Order Tickets)?</h5>
                        <p> Ans: Yes, it generates automated KOTs to send orders directly to the kitchen, reducing manual errors and improving speed.</p>
                    </Typography>
                </div>
            )}
        </div>

    );
}

export default Help;