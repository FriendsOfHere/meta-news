const _ = require("lodash")
const net = require("net")

function updateData() {
    const LIMIT = 10
    
    here.miniWindow.set({ title: "Updating…" })
    
    here.parseRSSFeed("{{rssFeedUrl}}")
    .then((feed) => {
        if (feed.items.length <= 0) {
            return here.miniWindow.set({ title: "No item found." })
        }
    
        if (feed.items.length > LIMIT) {
            feed.items = feed.items.slice(0, LIMIT)
        }
    
        const topFeed = feed.items[0]
    
        let popOvers = _.map(feed.items, (item, index) => {
            return {
                title: `${index + 1}. ${item.title}`,
                onClick: () => { if (item.link != undefined)  { here.openURL(item.link) } },
            }
        })

        // Mini Window
        here.miniWindow.set({
            onClick: () => { if (topFeed.link != undefined)  { here.openURL(topFeed.link) } },
            title: topFeed.title,
            detail: "{{miniDetail}}",
        })

        //popover
        here.popover.set(popOvers)
    })
    .catch((error) => {
        console.error(`Error: ${JSON.stringify(error)}`)
    })
}

here.onLoad(() => {
    updateData()
    // Update every 2 hours
    setInterval(updateData, 2*3600*1000);
})

net.onChange((type) => {
    console.log("Connection type changed:", type)
    if (net.isReachable()) {
        updateData()
    }
})
