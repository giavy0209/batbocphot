const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios')
const cheerio = require('cheerio')
const bot = new TelegramBot('5201931281:AAH-t_qdbuz6NDXm4_X5pPlIhWaY93FLexY', { polling: true });
const chatID = -1001710314209


const linkSended = []
const waitfor = ms => new Promise(r => setTimeout(r, ms))
async function main() {
    while (true) {
        try {
            const { data } = await axios.get('https://giaoduc.net.vn/', {
                headers: {
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.82 Safari/537.36',
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-encoding': 'gzip, deflate, br'
                }
            })
            const $ = cheerio.load(data, null, false)

            let array = []

            array = [...array, ...[...$('.story')]]

            array.forEach(async el => {
                const title = $(el).find('h2').text()
                if (
                    title.includes('FPT') ||
                    title.includes('fpt') ||
                    title.includes('phổ thông') ||
                    title.includes('cao đẳng')
                ) {
                    const aTag = $(el).find('a')
                    const link = aTag.attr('href')

                    if (!linkSended.includes(link)) {
                        await bot.sendMessage(chatID, `Nghi ngờ có phốt
link : ${link}
Để xem lại những link nghi ngờ, gõ /links
                    `)
                        linkSended.push(link)
                    }

                }
            })
        } catch (error) {
            console.log(error);
        }
        await waitfor(30000)
    }
}

main()


bot.on('message', async data => {
    if (data.text === '/links') {
        await bot.sendMessage(chatID, `Các bài viết nghi ngờ
${linkSended.join(' , ')}
        `)
    }
})