import { Icon } from '@prc/icons';

const Article = ({ article }) => {
	console.log({ article });
	// remove link atop most WP.org articles
	const content = article.content.replace(
		'<p class="has-text-align-right has-small-font-size"><a href="https://wordpress.org/documentation/article/blocks/">Go back to the list of <strong>Blocks</strong></a></p>',
		''
	);
	return (
		<>
			<div className="help-center__article-header">
				<h3>{article.title}</h3>
				<a href={article.url} target="_blank" rel="noopener noreferrer">
					View article on PRC Wiki <Icon icon="link" />
				</a>
			</div>
			<div className="help-center__article">
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>
		</>
	);
};

export default Article;
