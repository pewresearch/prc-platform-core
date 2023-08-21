import requests
import xml.etree.ElementTree as ET

def count_urls_in_sitemap(url):
    response = requests.get(url)
    tree = ET.fromstring(response.content)

    url_count = len(tree.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}url"))

    # Recursively search URLs in nested sitemaps
    sitemap_tags = tree.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}sitemap")
    for sitemap_tag in sitemap_tags:
        nested_sitemap_url = sitemap_tag.find("{http://www.sitemaps.org/schemas/sitemap/0.9}loc").text
        url_count += count_urls_in_sitemap(nested_sitemap_url)

    return url_count

# Sitemap 1
sitemap_1_url = "https://pewresearch.org/sitemap.xml"
sitemap_1_count = count_urls_in_sitemap(sitemap_1_url)

# Sitemap B
sitemap_b_url = "https://pewresearch.org/pewresearch-org/sitemap.xml"
sitemap_b_count = count_urls_in_sitemap(sitemap_b_url)

# Compare counts
if sitemap_1_count == sitemap_b_count:
    print("Both sitemaps have equal numbers of URLs.")
else:
    print("The number of URLs in the sitemaps is not equal.")
    print("Sitemap 1 URL count: ", sitemap_1_count)
    print("Sitemap B URL count: ", sitemap_b_count)
