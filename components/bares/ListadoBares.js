import React from "react";
import Bar from "./Bar";
import BarLoading from "./BarLoading";
import Layout from "../../components/Layout";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import MiPosicion from "./MiPosicion";
import useMyLocation from "./useMyLocation";
import InfiniteScroll from "react-infinite-scroll-component";

const ListadoBares = ({ user }) => {
  const [location, updateLocation] = useMyLocation();

  const { status, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["bares", location],
    ({ pageParam = 0 }) => getBares(location, pageParam),
    {
      enabled: !!location && location.length === 2,
      getNextPageParam: (lastPage, allPages) => {
        const morePagesExist = lastPage?.length === ROW_PER_PAGE;

        let result = allPages.length;
        if (!morePagesExist) result = false;

        return result;
      },
    }
  );

  const bares = data && data.pages ? data.pages.flatMap((bares) => bares) : [];

  const isLoading = status === "loading" || bares.length === 0;

  return (
    <Layout addLogo user={user}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <MiPosicion value={location} onFindMe={updateLocation} />
        <InfiniteScroll
          dataLength={bares ? bares.length : 0} //This is important field to render the next data
          next={() => {
            fetchNextPage();
          }}
          hasMore={hasNextPage}
          loader={<BarLoading />}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
          endMessage={
            <>
              {!isLoading && (
                <p style={{ textAlign: "center", color: "#fff" }}>
                  <b>Llegaste al final!</b>
                  <br />
                  Seguimos trabajando para sugerirte mas bares.
                </p>
              )}
            </>
          }
          // below props only if you need pull down functionality
          //refreshFunction={this.refresh}
          // pullDownToRefresh
          // pullDownToRefreshThreshold={50}
          // pullDownToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>
          //     &#8595; Pull down to refresh
          //   </h3>
          // }
          // releaseToRefreshContent={
          //   <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
          // }
        >
          {bares &&
            bares.map((bar) => <Bar key={`bar-${bar._id}`} value={bar} />)}
        </InfiniteScroll>

        {isLoading && (
          <>
            <BarLoading />
            <BarLoading />
            <BarLoading />
          </>
        )}
      </div>
    </Layout>
  );
};

export default ListadoBares;

const ROW_PER_PAGE = 10;

const getBares = async ([latitude, longitude], page = 0) => {
  if (!latitude || !latitude) {
    return { pages: [] };
  }

  const skip = page * ROW_PER_PAGE;

  const apiUrl = `${window.location.origin}/api/bares/getManyByLocation?latitude=${latitude}&longitude=${longitude}&skip=${skip}`;

  const { data } = await axios.get(apiUrl);

  return data;
};
