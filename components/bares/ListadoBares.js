import React, { useState, useRef } from "react";
import Bar from "./Bar";
import BarLoading from "./BarLoading";
import Layout from "../../components/Layout";
import axios from "axios";
import { useInfiniteQuery } from "react-query";
import MiPosicion from "./MiPosicion";
import useMyLocation from "components/hooks/useMyLocation";
import InfiniteScroll from "react-infinite-scroll-component";
import NearByPosicion from "./NearByPosicion";
import SearchIcon from "@material-ui/icons/Search";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import SearchInput from "./SearchInput";

const ListadoBares = ({ user, near, by }) => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [location, updateLocation] = useMyLocation();

  const isNearBy = near && by && by.includes(",");
  const point = isNearBy ? by.split(",") : location;

  const { status, data, fetchNextPage, hasNextPage } = useInfiniteQuery(
    ["bares", point, searchText],
    ({ pageParam = 0 }) => getBares(point, searchText, pageParam),
    {
      enabled: !!point && point.length === 2,
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
    <Layout addLogo addQRScan user={user}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 20,
            marginTop: 20,
            minHeight: 68,
          }}
        >
          <div
            style={{
              display: "flex",
              width: searchVisible ? "100%" : "70%",
              flex: 1,
            }}
          >
            {!searchVisible && !isNearBy && (
              <MiPosicion value={location} onFindMe={updateLocation} />
            )}
            {!searchVisible && isNearBy && <NearByPosicion value={near} />}
            {searchVisible && (
              <SearchInput
                onCancel={() => {
                  setSearchVisible(false);
                  setSearchText("");
                }}
                onSearchChange={(text) => {
                  setSearchText(text);
                }}
              />
            )}
          </div>
          {!searchVisible && (
            <div>
              <IconButton
                aria-label="search"
                color="secondary"
                onClick={() => {
                  setSearchVisible(true);
                }}
              >
                {!searchVisible && <SearchIcon fontSize="large" />}
                {searchVisible && <CancelIcon fontSize="large" />}
              </IconButton>
            </div>
          )}
        </div>
        <InfiniteScroll
          dataLength={bares ? bares.length : 0} //This is important field to render the next data
          next={() => {
            fetchNextPage();
          }}
          hasMore={hasNextPage}
          loader={null}
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

          {isLoading && (
            <>
              <BarLoading />
              <BarLoading />
              <BarLoading />
            </>
          )}
        </InfiniteScroll>
      </div>
    </Layout>
  );
};

export default ListadoBares;

const ROW_PER_PAGE = 10;

const getBares = async ([latitude, longitude], searchText, page = 0) => {
  if (!latitude || !latitude) {
    return { pages: [] };
  }

  const skip = page * ROW_PER_PAGE;

  const apiUrl = `${window.location.origin}/api/bares/getManyByLocation?latitude=${latitude}&longitude=${longitude}&skip=${skip}&search=${searchText}`;

  const { data } = await axios.get(apiUrl);

  return data;
};
