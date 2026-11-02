/**
 * Returns a new Url without the watch later if it existed
 */
function getNewUrl(url) {
    const index = url.indexOf("&list=WL");
    if (index != -1) {
        const timeIndex = url.indexOf("&t=", index + 8);
        if (timeIndex != -1) {
            return url.slice(0, index) + url.slice(timeIndex);
        } else {
            return url.substring(0, index);
        }
    } else {
        return url;
    }
}

/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
document.addEventListener("click", async (e) => {
    /**
     * Removes the Watch-later from URL
     */
    async function removeWl() {
        const tabs = await browser.tabs.query({
            currentWindow: true,
            url: "*://www.youtube.com/*",
        });

        let changes = [];

        tabs.forEach(tab => {
            const newUrl = getNewUrl(tab.url);
            browser.tabs.update(tab.id, {
                url: newUrl,
            });
        });
        await Promise.all(changes);
    }

    try {
        await removeWl();
    } catch (error) {
        console.error(`Failed to remove WL: ${error}`);
    }
});
