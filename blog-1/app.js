const handleUserRouter = require('./src/router/user')
const handleBlogRouter = require('./src/router/blog')
const querystring = require('querystring')
// session数据
const SESSION_DATA = {}
// 处理Post Data
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method in ['GET', 'DELETE']) {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
    return promise;

}


const serverHandle = (req, res) => {
    res.setHeader('Content-type', 'application/json')

    // 处理blog路由
    const url = req.url
    req.path = url.split('?')[0]

    //解析query
    req.query = querystring.parse(url.split('?')[1])
    // 解析 cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(";").forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')

        const key = arr[0].trim()
        const val = arr[1]
        req.cookie[key] = val
    });
    // 解析session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]

    // 处理post data
    getPostData(req).then(postData => {
        req.body = postData
        // 处理blog 路由

        const blogResult = handleBlogRouter(req, res)

        if (blogResult) {
            blogResult.then(
                blogData => {
                    if (needSetCookie) {
                        res.setHeader('Set-Cookie', `userid=${userId}`)
                    }
                    res.end(JSON.stringify(blogData))
                })
            return
        }
        // 处理user路由
        const userResult = handleUserRouter(req, res)

        if (userResult) {
            userResult.then(userData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }
        //未命中路由
        res.writeHead(404, { "Content-type": 'text/plain' })
        res.write('404 Not Found\n')
        res.end()
    })


}

module.exports = serverHandle

