export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { url } = req.body
  if (!url) return res.status(400).json({ error: 'URL manquante' })

  try {
    // Fetch the AliExpress page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        'Referer': 'https://www.aliexpress.com/',
      }
    })

    const html = await response.text()

    // Extract images from AliExpress page
    const images = []

    // Method 1: Extract from imagePathList
    const imagePathMatch = html.match(/"imagePathList"\s*:\s*\[([^\]]+)\]/i)
    if (imagePathMatch) {
      const paths = imagePathMatch[1].match(/"([^"]+\.jpg[^"]*|[^"]+\.png[^"]*)"/gi)
      if (paths) {
        paths.forEach(p => {
          const clean = p.replace(/"/g, '').replace(/\\u002F/g, '/').replace(/\\\//g, '/')
          if (clean.startsWith('http') && !images.includes(clean)) {
            images.push(clean)
          }
        })
      }
    }

    // Method 2: Extract from og:image and similar meta tags
    const metaImages = html.match(/content="(https:\/\/[^"]*(?:\.jpg|\.png|\.webp)[^"]*)"/gi)
    if (metaImages) {
      metaImages.slice(0, 5).forEach(m => {
        const url = m.replace(/content="/i, '').replace(/"$/, '')
        if (url.startsWith('http') && !images.includes(url)) {
          images.push(url)
        }
      })
    }

    // Method 3: Look for image URLs in script tags
    const scriptImages = html.match(/https:\/\/ae01\.alicdn\.com\/kf\/[A-Za-z0-9_\-]+\.jpg/g)
    if (scriptImages) {
      scriptImages.slice(0, 10).forEach(url => {
        if (!images.includes(url)) images.push(url)
      })
    }

    // Extract product title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].replace(' - AliExpress', '').trim() : ''

    // Extract price
    const priceMatch = html.match(/["']price["']\s*:\s*["']([0-9.,]+)["']/i)
    const price = priceMatch ? priceMatch[1] : ''

    if (images.length === 0) {
      return res.status(200).json({
        images: [],
        title,
        price,
        message: 'Aucune image trouvée. AliExpress bloque parfois le scraping. Essaie de copier manuellement les URLs des images.'
      })
    }

    return res.status(200).json({
      images: images.slice(0, 8),
      title,
      price,
      total: images.length
    })

  } catch (e) {
    return res.status(500).json({ error: 'Erreur scraping: ' + e.message })
  }
}
