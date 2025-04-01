import React from "react";


function AppPage() {
    let domainName=window.location.href.indexOf('localhost') > 0 ?'xmedia-solutions.net':window.location.origin;
    // Replace with actual AWS file URLs for APKs or executables
    const androidPOSUrl = "https://digisign24.s3.ap-south-1.amazonaws.com/apps/"+domainName+"/android/pos.apk";
    const androidSOKUrl = "https://digisign24.s3.ap-south-1.amazonaws.com/apps/"+domainName+"/android/sok.apk";
    const iosPOSUrl = "https://your-aws-bucket/ios-pos-app.ipa";
    const iosSOKUrl = "https://your-aws-bucket/ios-sok-app.ipa";
    const windowsPOSUrl = "https://digisign24.s3.ap-south-1.amazonaws.com/apps/"+domainName+"/windows/pos.zip";
    const windowsSOKUrl = "https://digisign24.s3.ap-south-1.amazonaws.com/apps/"+domainName+"/windows/sok.zip";

    const handleDownload = (url) => {
        window.open(url, '_blank');
    };



    return (
        <div style={styles.container}>
            {/* Heading */}
            <h1 style={styles.header}>Download Apps</h1>
            
            <div style={styles.tilesContainer}>
                {/* Android Section */}
                <div style={styles.tile}>
                    <img src={"./images/android.png"} alt="Android Icon" style={styles.icon} />
                    <p>Android App</p>
                    <div style={styles.buttonContainer}>
                        <button
                            style={styles.downloadButton}
                            onClick={() => handleDownload(androidPOSUrl)}
                        >
                            Download POS
                        </button>
                        <button
                            style={styles.downloadButton}
                            onClick={() => handleDownload(androidSOKUrl)}
                        >
                            Download SOK
                        </button>
                    </div>
                </div>

                 {/* Windows Section */}
                <div style={styles.tile}>
                    <img src={"./images/windows-icon.png"} alt="Windows Icon" style={styles.icon} />
                    <p>Windows App</p>
                    <div style={styles.buttonContainer}>
                        <button
                            style={styles.downloadButton}
                            onClick={() => handleDownload(windowsPOSUrl)}
                        >
                            Download POS
                        </button>
                        <button
                            style={styles.downloadButton}
                            onClick={() => handleDownload(windowsSOKUrl)}
                        >
                            Download SOK
                        </button>
                    </div>
                </div>

                {/* iOS Section */}
                <div style={styles.tile}>
                    <img src={"./images/ios.png"} alt="iOS Icon" style={styles.icon} />
                    <p>iOS App</p>
                    <div style={styles.buttonContainer}>
                        <button
                            style={styles.downloadButton}
                            onClick={() => handleDownload(iosPOSUrl)}
                        >
                            Download POS
                        </button>
                        <button
                            style={styles.downloadButton}
                            onClick={() => handleDownload(iosSOKUrl)}
                        >
                            Download SOK
                        </button>
                    </div>
                </div>

               
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
    },
    header: {
        position: 'absolute',
        top: '50px',
        left: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    tilesContainer: {
        display: 'flex',
        gap: '20px',
        marginTop: '40px',
        flexWrap: 'wrap',
        flexDirection:'row',
        overflow: 'hidden',
        height: 'calc(100vh - 190px)',
        overflowY: 'auto',
        padding:'20px',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tile: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid #ccc',
        borderRadius: '10px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'transform 0.3s',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    },
    icon: {
        width: '100px',
        height: '100px',
        marginBottom: '10px',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: '10px',
    },
    downloadButton: {
        padding: '10px',
        fontSize: '14px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        flex: '1',
        margin: '0 5px',
    },
};

export default AppPage;