import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  // const [hasMore, setHasMore] = useState(true)
  // const hasFetchedOnce = useState(false)
  
  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };
  
  // constructor(props) {
    //   super(props);
    //   this.state = {
      //     articles: [],
      //     loading: false, // start without showing spinner
      //     page: 1,
      //     totalArticles: 0,
      //     hasMore: true,
      //     hasFetchedOnce: false, // to prevent double-fetch in dev StrictMode
      //   };
      // }
      
      const updateNews = async () => {
        // if (hasFetchedOnce) return;
    // this.setState({ loading: true, hasFetchedOnce: true });
    props.setProgress(10);
    const url = `https://gnews.io/api/v4/top-headlines?country=${props.country}&lang=en&category=${props.category}&max=${props.pageSize}&page=${props.page}&apikey=${props.apiKey}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalArticles(parsedData.totalArticles);
    setLoading(false);
    // setHasMore(parsedData.articles.length >= props.pageSize)
    // this.setState({
      //   articles: articles,
      //   totalArticles: parsedData.totalArticles || 0,
      //   loading: false,
      //   hasMore: articles.length >= props.pageSize,
      // });
      props.setProgress(100);
    };
    
    useEffect(() => {
      document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
      updateNews();
  }, []);

  // componentDidMount() {
  //   this.updateNews();
  // }

  const handlePrevClick = async () => {
    setPage(page - 1);
    updateNews();
  };

  const handleNextClick = async () => {
    setPage(page + 1);
    updateNews();
  };

  const fetchMoreData = async () => {
    const url = `https://gnews.io/api/v4/top-headlines?country=${props.country}&lang=en&category=${props.category}&max=${props.pageSize}&page=${page+1}&apikey=${props.apiKey}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();

    // const articles = parsedData.articles || [];
    // const noMoreData = articles.length < props.pageSize;

    setArticles(articles.concat(parsedData.articles));
    setTotalArticles(parsedData.totalArticles);
    // setLoading(false)
    // setHasMore(!noMoreData)
    // this.setState((prevState) => ({
    //   articles: prevState.articles.concat(articles),
    //   page: nextPage,
    //   loading: false,
    //   hasMore: !noMoreData,
    // }));
  };

  return (
    <>
      <h1 className="text-center" style={{ margin: "35px 0px" ,marginTop: "90px"}}>
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines
      </h1>
      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalArticles}
        loader={<Spinner/>}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.image}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "world",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
