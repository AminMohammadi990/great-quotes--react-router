import { useEffect } from "react";
import { useParams, Route, Link, useRouteMatch } from "react-router-dom";

import useHttp from "../hooks/use-http";
import { getSingleQuote } from "../lib/api";

import Comments from "../components/comments/Comments";
import HighlightedQuote from "../components/quotes/HighlightedQuote";
import LoadingSpinner from "../components/UI/LoadingSpinner";


const DUMMY_QUOTES = [
  {
    id: "q1",
    author: "Amin",
    text: "Learning React is Fun!",
  },
  {
    id: "q2",
    author: "Max",
    text: "Learning React Custom Hooks is Sucks",
  },
];

const QuoteDetail = () => {
  const {
    sendRequest,
    data: loadedQuote,
    status,
    error,
  } = useHttp(getSingleQuote, true);

  const params = useParams();
  const match = useRouteMatch();

  const { quoteId } = params;

  useEffect(() => {
    sendRequest(quoteId);
  }, [sendRequest, quoteId]);

  const quote = DUMMY_QUOTES.find((quote) => quote.id === params.quoteId);

  if (status === "pending") {
    return (
      <div className="centered">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return <p className="centered">{error}</p>;
  }

  if (!loadedQuote.text) {
    return <p>Found no Quotes</p>;
  }

  return (
    <div>
      <HighlightedQuote text={loadedQuote.text} author={loadedQuote.author} />
      <Route path={match.path} exact>
        <div className="centered">
          <Link to={`${match.url}/comments`} className="btn--flat">
            Load Comments
          </Link>
        </div>
      </Route>
      <Route path={`${match.path}/comments`}>
        <Comments />
      </Route>
    </div>
  );
};

export default QuoteDetail;
