import { useMemo, useState } from 'react'
import { Button, Empty } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppContext } from '@/context/AppContext'
import { BLOG_CATEGORIES } from '@/constants/categories'
import { truncateHtml } from '@/utils/formatters'
import { getBlogDetailPath } from '@/constants/routes'
import './BlogList.css'

const PAGE_SIZE = 8

function BlogList() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const { blogs, input, fetchBlogs } = useAppContext()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const filteredBlogs = useMemo(() => {
    let result = blogs

    if (input) {
      result = result.filter((blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        (blog.category || '').toLowerCase().includes(input.toLowerCase())
      )
    }

    if (activeCategory !== 'All') {
      result = result.filter((blog) => (blog.category || '').trim() === activeCategory)
    }

    return result
  }, [blogs, input, activeCategory])

  const visibleBlogs = filteredBlogs.slice(0, visibleCount)

  const selectCategory = async (category) => {
    setActiveCategory(category)
    setVisibleCount(PAGE_SIZE)
    await fetchBlogs()
    setTimeout(() => {
      document.querySelector('.blog-grid, .blog-empty')?.scrollIntoView({ block: 'nearest' })
    }, 0)
  }

  return (
    <section className="blog-list" id="recent-articles">
      <h2 className="blog-list-title">{t('blog.recentArticles')}</h2>

      <div className="blog-filters">
        {BLOG_CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`blog-filter${activeCategory === category ? ' is-active' : ''}`}
            onClick={() => selectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {visibleBlogs.length === 0 ? (
        <Empty className="blog-empty" description={t('blog.noBlogs')} />
      ) : (
        <div className="blog-grid">
          {visibleBlogs.map((blog) => (
            <button
              key={blog._id}
              type="button"
              className="blog-card"
              onClick={() => navigate(getBlogDetailPath(blog._id))}
            >
              <img src={blog.image} alt={blog.title} />
              <h3 className="blog-card-title">{blog.title}</h3>
              <p className="blog-card-description">
                {truncateHtml(blog.description, 90)}
              </p>
            </button>
          ))}
        </div>
      )}

      {visibleCount < filteredBlogs.length && (
        <div className="blog-more">
          <Button onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            {t('blog.showMore')}
          </Button>
        </div>
      )}
    </section>
  )
}

export default BlogList
