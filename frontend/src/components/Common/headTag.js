import {Helmet} from "react-helmet";

const HeadTag = ({ title }) => (
  <Helmet>
    <title>{title || 'Welcome to Cluster DAO'}</title>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="icon" type="image/svg" href="/brand-logo.svg" />
  </Helmet>
);

export default HeadTag;
