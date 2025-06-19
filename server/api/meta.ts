import { defineEventHandler, getQuery } from 'h3'
import { load } from 'cheerio'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const url = query.url as string

  if (!url) {
    return {
      error: 'URL is required'
    }
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = load(html)

    // ดึง meta tags
    const title = $('meta[property="og:title"]').attr('content') || $('title').text()
    const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content')
    const image = $('meta[property="og:image"]').attr('content') || $('meta[name="twitter:image"]').attr('content')

    return {
      title,
      description,
      image
    }
  } catch (error) {
    console.error('Error fetching meta:', error)
    return {
      error: 'Failed to fetch meta data'
    }
  }
}) 