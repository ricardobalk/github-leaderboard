import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import Chart from '../components/chart';

export async function getStaticProps() {
  const client = new ApolloClient({
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    },
    uri: 'https://api.github.com/graphql',
    cache: new InMemoryCache()
  });

  const queryProperties = {
    ghUsername: 'linkunijmegen',
    last: 100, // Number of repos to fetch
    since: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00Z', // Get the past month ISO8601
    until: new Date(Date.now()).toISOString(), // Get now ISO8601
  };

  const { data: commitHistory } = await client.query({
  query: gql`
  query Repositories {
    organization(login: "${queryProperties.ghUsername}") {
      repositories(last: ${queryProperties.last}) {
        nodes {
          name
          commitComments {
            totalCount
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(until: "${queryProperties.until}", since: "${queryProperties.since}") {
                  totalCount
                }
              }
            }
          }
        }
      }
    }
  }
  `
});
  
  const repoAndCommitCount = commitHistory.organization.repositories.nodes.map(repo => ({
      name: repo.name,
      commitCount: repo.defaultBranchRef.target.history.totalCount,
  }));
  const totalNumberOfRepositories = commitHistory.organization.repositories.nodes.length;
  const totalNumberOfCommits = repoAndCommitCount.reduce((total, repo) => total + repo.commitCount, 0);
  const mostPopularRepo = repoAndCommitCount.sort((a, b) => b.commitCount - a.commitCount)[0];
  const topFiveRepos = repoAndCommitCount.sort((a, b) => b.commitCount - a.commitCount);
  const topRepoData = topFiveRepos.map(repo => ({
    name: repo.name,
    commits: repo.commitCount,
  })).filter(repo => repo.commits > 0);

  return {
    props: {
      commitHistory,
      totalNumberOfRepositories,
      repoAndCommitCount,
      mostPopularRepo,
      topFiveRepos,
      topRepoData,
      totalNumberOfCommits,
    }
  }
}

export default function Home({...props}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Linku Leaderboard</title>
        <meta name="description" content="Linku GitHub leaderboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          This past month
        </h1>

        <div className={styles.grid}>
          <a href="#commits" className={styles.card}>
            <h2>Commit count &rarr;</h2>
            <p>{props.totalNumberOfCommits} contributions in {props.totalNumberOfRepositories} repositories.</p>
          </a>

          <a href="#most-popular" className={styles.card}>
            <h2>Most popular repository of this past month &rarr;</h2>
            <p><strong>{props.mostPopularRepo.name}</strong> with a whooping {props.mostPopularRepo.commitCount} contributions.!</p>
          </a>

          <div className="top-five">
            <h2>Top 5 repositories</h2>
            <ul>
              {props.topFiveRepos.map(repo => (
                <li>
                  <strong>{repo.name}</strong> with {repo.commitCount} contributions.
                </li>
              ))}
            </ul>
          </div>

          <div className="graph">
            <Chart data={props.topRepoData}/>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/linku"
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit GitHub profile
        </a>
      </footer>
    </div>
  )
}
