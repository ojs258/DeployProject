"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout(request) {
  let [news, setDetailNews] = useState([]);
  let [opinions, setOpinionData] = useState([]);
  let [newComment, setNewComment] = useState('');

  useEffect(() => {
    getDetailNews();
    getOpinion();
  }, []);

  const getDetailNews = () => {
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
      var newsUrl = window.localStorage.getItem("newsUrl");
    }
    fetch(`/api/news/detail?newsUrl=${newsUrl}`, {
      method: "GET",
      headers: {
        "X-AUTH-TOKEN": token,
      },
    }).then((res) => res.json())
      .then((data) => {
        setDetailNews(data);
      });
  };

  const getOpinion = () => {
    if (typeof window !== "undefined") {
      var token = window.localStorage.getItem("token");
      var newsUrl = window.localStorage.getItem("newsUrl");
    }
    fetch(`/api/opinions/news/like?page=${1}&limit=${10}&newsUrl=${newsUrl}`, {
        method: "GET",
        headers: {
          "X-AUTH-TOKEN": token,
        },
    }).then((res) => res.json())
      .then((data) => {
        setOpinionData(data.opinions);
      });
  };

  const addComment = () => {
    if (typeof window !== "undefined") {
        var token = window.localStorage.getItem("token");
        var newsUrl = window.localStorage.getItem("newsUrl");
    }
    const opinionContent = document.getElementById("opinion_contents").value;

    fetch(`/api/opinions`, {
    method: "POST",
    headers: {
        "X-AUTH-TOKEN": token,
        "Content-Type": "application/json",
    },
    //전송할 데이터 json으로 변환해서 body에 넣어줌
    body: JSON.stringify({ newsUrl, opinionContent }),
    }).then((res) => res.json())
      .then((data) => {
        setOpinionData([...opinions, data.opinion]);
        setNewComment('');
    });
  };

  const imageLazyLoading = () => {
    useEffect(() => {
      const imgs = document.querySelectorAll("img");
      imgs.forEach((img) => {
        if (img.className == "_LAZY_LOADING") {
          img.src = img.dataset.src;
        }
      });
    });
  };

  const likeOpinionClick = (buttonIndex) => {
    // Define a function to handle button clicks
    alert(`Button ${buttonIndex} likeOpinionClick!`);
  };

  const dislikeOpinionClick = (buttonIndex) => {
    // Define a function to handle button clicks
    alert(`Button ${buttonIndex} dislikeOpinionClick!`);
  };

  const removeOpinionClick = (buttonIndex) => {
    // Define a function to handle button clicks
    alert(`Button ${buttonIndex} removeOpinionClick!`);
  };

  const opinionButton = (opinion) => {
    if (opinion.modifiable == true){
        // 로그인한 회원이 작성한 의견
        return ( 
            <table className="tableTypeBtn">
                <colgroup>
                    <col style={{ width: "50%" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <td>
                            <button className="btnRed wid90" key={opinion.opinionId} onClick={() => removeOpinionClick(opinion.opinionId)}>
                                삭제
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }else{
        // 다른 회원의 의견
        return (
        <table className="tableTypeBtn">
            <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "50%" }} />
            </colgroup>
            <tbody>
                <tr>
                    <td>
                        <button className="btnBlue wid90 mr10" key={opinion.opinionId} onClick={() => likeOpinionClick(opinion.opinionId)}>
                            좋아요
                        </button>
                    </td>
                    <td>
                        <button className="btnRed wid90" key={opinion.opinionId} onClick={() => dislikeOpinionClick(opinion.opinionId)}>
                            싫어요
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        )
    }
  };

  const scrapButton = () => {

  };

  return (
    <div className="wrap">
      <div className="tableWrap3">
        <table className="tableTypeBoard2">
          <colgroup>
            <col style={{ width: "13%" }} />
            <col style={{ width: "60%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <tbody>
            <tr>
              <th>제목</th>
              <td className="bold">{news.title}</td>
              <th>작성일</th>
              <td>{news.postDateTime}</td>
            </tr>
            <tr>
              <th>작성자</th>
              <td>{news.reporter}</td>
              <th>언론사</th>
              <td>{news.media}</td>
            </tr>
            <tr>
              <th>기사링크</th>
              <td>
                <a href={news.url}>{news.url}</a>
              </td>
              <th>관심</th>
              <td>
                <button type="button" className="btnRed">
                  찜하기
                </button>
              </td>
            </tr>
            <tr>
              <td colSpan="6" className="viewBox">
                <div
                  onLoad={imageLazyLoading()}
                  dangerouslySetInnerHTML={{
                    __html: `${news.contents}`,
                  }}
                ></div>
                {/* {newscontents.contents} */}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="floatBox mt10 mb10">
          <textarea className="h100" id="opinion_contents" name="" value={newComment} onChange={(e) => setNewComment(e.target.value)}></textarea>
          <div className="fr">
            <button
              type="button"
              className="btnGray wid90"
              onClick={() => addComment()}
            >
              의견 등록
            </button>
          </div>
        </div>
        <div className="floatBox mt10 mb10">
          <div className="left">
            <button type="button" className="btnLight mr5">
              공감순
            </button>
            <button type="button" className="btnLight">
              최신순
            </button>
          </div>
        </div>
        <table className="tableTypeBoard">
          <colgroup>
            <col style={{ width: "7%" }} />
            <col style={{ width: "10%" }} />
            <col style={{ width: "50%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>No.</th>
              <th>작성자</th>
              <th>의견 내용</th>
              <th>작성일</th>
              <th>공감</th>
            </tr>
          </thead>
          <tbody>
            {opinions.map((opinion, index) => {
              return (
                <tr key={opinion.opinionId}>
                  <td>{index + 1}</td>
                  <td>{opinion.memberName}</td>
                  <td>{opinion.opinionContent}</td>
                  <td>{opinion.opinionCreateDate}</td>
                  <td>{opinionButton(opinion)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="floatBox mt10">
          <button type="button" className="btnBlue wid90 mr10">
            추천
          </button>
          <button type="button" className="btnRed wid90">
            반대
          </button>
          <div className="fr">
            <Link href="/">
              <button type="button" className="btnLight wid90">
                목록
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
