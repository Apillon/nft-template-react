import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Mint from "./mint";

export default function collection({ collection, provider, address }) {
  const [totalSupply, setTotalSupply] = useState(
    collection.totalSupply.toNumber()
  );
  const [maxSupply, setMaxSupply] = useState(collection.maxSupply.toNumber());
  const [dropStartDate, setDropStartDate] = useState(new Date());
  const [dropStartTimestamp, setDropStartTimestamp] = useState(0);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const setupDropStartTimestamp = () => {
    if (dropStartTimestamp) return dropStartTimestamp;

    const newTimestamp = collection.dropStart.toNumber() * 1000;
    setDropStartTimestamp(newTimestamp);

    return newTimestamp;
  };

  useEffect(() => {
    if (collection) {
      loadInfo();
    }
  }, []);

  function loadInfo() {
    if (collection.drop) {
      const dropStartTimestamp = setupDropStartTimestamp();
      setDropStartDate(new Date(dropStartTimestamp));

      if (dropStartTimestamp > Date.now()) {
        // The data/time we want to countdown to
        countdown(dropStartTimestamp);

        // Run myfunc every second
        var myfunc = setInterval(() => {
          countdown(dropStartTimestamp);
          // Display the message when countdown is over
          var timeleft = dropStartTimestamp - new Date().getTime();
          if (timeleft < 0) {
            clearInterval(myfunc);
          }
        }, 1000);
      }
    }
  }

  const countdown = (date) => {
    var now = new Date().getTime();
    var timeleft = date - now;

    // Calculating the days, hours, minutes and seconds left
    setDays(Math.floor(timeleft / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    setMinutes(Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)));
    setSeconds(Math.floor((timeleft % (1000 * 60)) / 1000));
  };

  return (
    <div className="collection-info" id="collection">
      <div>
        <b> Name: </b>
        {collection.name}
      </div>
      <div>
        <b> Symbol: </b>
        {collection.symbol}
      </div>
      <div>
        <b> Soulbound: </b>
        {collection.soulbound ? "TRUE" : "FALSE"}
      </div>
      <div>
        <b> Supply: </b>
        {totalSupply}/{maxSupply}
      </div>
      {/* Is drop */}
      {collection.drop && (
        <div>
          <div>
            <b> Price: </b>
            {ethers.utils.formatEther(collection.price)}
          </div>
          {(() => {
            if (totalSupply === maxSupply) {
              return <h3>Sold out!</h3>;
            } else if (dropStartTimestamp > Date.now()) {
              return (
                <div className="drop" id="drop">
                  <div>
                    <b> Drop: </b>
                    {dropStartDate.toDateString()}{" "}
                    {dropStartDate.toLocaleTimeString()} {days} <b>d </b>
                    {hours} <b>h </b>
                    {minutes} <b>m </b>
                    {seconds} <b>s </b>
                  </div>
                </div>
              );
            } else {
              return (
                <Mint
                  price={collection.price}
                  provider={provider}
                  address={address}
                />
              );
            }
          })()}
        </div>
      )}
    </div>
  );
}
