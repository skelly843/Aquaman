'use client'

import { useWebsiteBuilder } from '@/context/WebsiteBuilderContext'
import { googleFontsHref, themeCss } from '@/utils/siteTheme'

/** Applies the brand colors, fonts and corners. Server-rendered for visitors; live-updates while an admin edits. */
export default function SiteTheme() {
  const { styles } = useWebsiteBuilder()
  const css = themeCss(styles)
  const fonts = googleFontsHref(styles)
  return (
    <>
      {fonts && <link rel="stylesheet" href={fonts} precedence="default" />}
      {css && <style id="site-theme" dangerouslySetInnerHTML={{ __html: css }} />}
    </>
  )
}

/** The site name for places outside the editable pages (portal, login, admin). */
export function SiteName({ prefix = '', suffix = '' }: { prefix?: string; suffix?: string }) {
  const { styles } = useWebsiteBuilder()
  return <>{`${prefix}${styles.site_name}${suffix}`}</>
}
