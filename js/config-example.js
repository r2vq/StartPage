const config = {
    background: "img/silk-wall.jpg",
    foreground: "img/silk-sticker.webp",
    modules: [
        {
            type: "time",
        },
        {
            type: "date",
        },
        {
            type: "quote",
        },
        {
            type: "buttons",
            data: [
                {
                    key: "y",
                    url: "https://www.youtube.com/",
                    color: "#ff0000",
                    image: {
                        type: "awesome",
                        classes: [
                            "fab",
                            "fa-youtube"
                        ]
                    }
                },
                {
                    key: "5",
                    url: "https://www.reddit.com/",
                    color: "#ff4301",
                    image: {
                        type: "awesome",
                        classes: [
                            "fab",
                            "fa-reddit-alien"
                        ]
                    }
                },
                {
                    key: "s",
                    url: "https://open.spotify.com/",
                    color: "#1ed761",
                    image: {
                        type: "awesome",
                        classes: [
                            "fab",
                            "fa-spotify"
                        ]
                    }
                },
                {
                    key: "t",
                    url: "https://web.telegram.org/",
                    color: "#0088cc",
                    image: {
                        type: "awesome",
                        classes: [
                            "fab",
                            "fa-telegram"
                        ]
                    }
                },
                {
                    key: "m",
                    url: "https://www.messenger.com/",
                    color: "#00c6ff",
                    image: {
                        type: "awesome",
                        classes: [
                            "fab",
                            "fa-facebook-messenger"
                        ]
                    }
                },
                {
                    key: "w",
                    url: "https://web.whatsapp.com/",
                    color: "#4fce5d",
                    image: {
                        type: "awesome",
                        classes: [
                            "fab",
                            "fa-whatsapp"
                        ]
                    }
                },
                {
                    key: "d",
                    url: "https://discord.com/app/",
                    color: "#738adb",
                    image: {
                        type: "awesome",
                        classes: [
                            "fab",
                            "fa-discord"
                        ]
                    }
                },
                {
                    key: "v",
                    url: "https://drive.google.com/",
                    color: "#ffd04b",
                    image: {
                        type: "awesome",
                        classes: [
                            "fab",
                            "fa-google-drive"
                        ]
                    }
                }
            ]
        }
    ]
};
