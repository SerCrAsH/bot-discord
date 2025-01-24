const IOS_CLIENT_VERSION = "19.42.1",
    IOS_DEVICE_MODEL = "iPhone16,2",
    IOS_USER_AGENT_VERSION = "17_5_1",
    IOS_OS_VERSION = "17.5.1.21F90";

const ANDROID_CLIENT_VERSION = "19.30.36",
    ANDROID_OS_VERSION = "14",
    ANDROID_SDK_VERSION = "34";

const IOS_CLIENT = {
    client: {clientName: "IOS",
                clientVersion: IOS_CLIENT_VERSION,
                deviceMake: "Apple",
                deviceModel: IOS_DEVICE_MODEL,
                platform: "MOBILE",
                osName: "iOS",
                osVersion: IOS_OS_VERSION,
                hl: "en",
                gl: "US",
                utcOffsetMinutes: -240
    }, 
    headers: {

    }
};

const fetchMobileJsonPlayer = async (videoId, options) => {
    const payload = {
        videoId,
        cpn: utils.generateClientPlaybackNonce(16),
        contentCheckOk: true,
        racyCheckOk: true,
        context: {
            client: options.client,
            request: {
                internalExperimentFlags: [],
                useSsl: true,
            },
            user: {
                lockedSafetyMode: false,
            },
        }
    }
}

launch = async () =>{
    const options = {
        client: IOS_CLIENT.client,
        headers: IOS_CLIENT.headers
    };
    fetchMobileJsonPlayer(videoId, options);
}

const fetchIosJsonPlayer = async (videoId, options) => {
    const payload = {
        context: {
            client: {
                clientName: "IOS",
                clientVersion: IOS_CLIENT_VERSION,
                deviceMake: "Apple",
                deviceModel: IOS_DEVICE_MODEL,
                platform: "MOBILE",
                osName: "iOS",
                osVersion: IOS_OS_VERSION,
                hl: "en",
                gl: "US",
                utcOffsetMinutes: -240,
            },
            request: {
                internalExperimentFlags: [],
                useSsl: true,
            },
            user: {
                lockedSafetyMode: false,
            },
        },
    };

    const { jar, dispatcher } = options.agent;
    const opts = {
        requestOptions: {
            method: "POST",
            dispatcher,
            query: {
                prettyPrint: false,
                t: utils.generateClientPlaybackNonce(12),
                id: videoId,
            },
            headers: {
                "Content-Type": "application/json",
                cookie: jar.getCookieStringSync("https://www.youtube.com"),
                "User-Agent": `com.google.ios.youtube/${IOS_CLIENT_VERSION}(${IOS_DEVICE_MODEL
                    }; U; CPU iOS ${IOS_USER_AGENT_VERSION} like Mac OS X; en_US)`,
                "X-Goog-Api-Format-Version": "2",
            },
            body: JSON.stringify(payload),
        },
    };
    const response = await utils.request("https://youtubei.googleapis.com/youtubei/v1/player", opts);
    const playErr = utils.playError(response);
    if (playErr) throw playErr;
    if (!response.videoDetails || videoId !== response.videoDetails.videoId) {
        const err = new Error("Malformed response from YouTube");
        err.response = response;
        throw err;
    }
    return response;
};



const fetchAndroidJsonPlayer = async (videoId, options) => {
    const payload = {
        videoId,
        cpn: utils.generateClientPlaybackNonce(16),
        contentCheckOk: true,
        racyCheckOk: true,
        context: {
            client: {
                clientName: "ANDROID",
                clientVersion: ANDROID_CLIENT_VERSION,
                platform: "MOBILE",
                osName: "Android",
                osVersion: ANDROID_OS_VERSION,
                androidSdkVersion: ANDROID_SDK_VERSION,
                hl: "en",
                gl: "US",
                utcOffsetMinutes: -240,
            },
            request: {
                internalExperimentFlags: [],
                useSsl: true,
            },
            user: {
                lockedSafetyMode: false,
            },
        },
    };

    const { jar, dispatcher } = options.agent;
    const opts = {
        requestOptions: {
            method: "POST",
            dispatcher,
            query: {
                prettyPrint: false,
                t: utils.generateClientPlaybackNonce(12),
                id: videoId,
            },
            headers: {
                "Content-Type": "application/json",
                cookie: jar.getCookieStringSync("https://www.youtube.com"),
                "User-Agent": `com.google.android.youtube/${ANDROID_CLIENT_VERSION
                    } (Linux; U; Android ${ANDROID_OS_VERSION}; en_US) gzip`,
                "X-Goog-Api-Format-Version": "2",
            },
            body: JSON.stringify(payload),
        },
    };
    const response = await utils.request("https://youtubei.googleapis.com/youtubei/v1/player", opts);
    const playErr = utils.playError(response);
    if (playErr) throw playErr;
    if (!response.videoDetails || videoId !== response.videoDetails.videoId) {
        const err = new Error("Malformed response from YouTube");
        err.response = response;
        throw err;
    }
    return response;
};