import { useNavigate, useParams } from "react-router-dom";
import * as S from "../../../styles/mypage/PostView.style";

import { useEffect, useReducer, useRef, useState } from "react";


import { useDispatch } from "react-redux";

import { POST_READ, POST_REMOVE } from "../../../api/post";
import axios from "axios";


function PostView() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const dispatch = useDispatch();

  const [onPlay, setOnPlay] = useState(false);
  const audioRef = useRef(null);

  const [postObject, setPostObject] = useState({
    postId: 0,
    userId: 0,
    postTitle: "",
    postCategory: "",
    postContent: "",
    audioUrl: "",
    thumbnailUrl: "",
    postSummary: "",
    isDeleted: false,
    createdAt: "",
    updatedAt: "",
  });
  const handleEdit = () => {
    navigate(`/edit/${postId}`); // todo
  };
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmDelete) {
      console.log("Post deleted");
      // todo 삭제 API를 호출
    } else {
      console.log("Post not deleted");
    }
  };

  const postdate = new Date(postObject.createdAt);
  useEffect(() => {
    POST_READ(postId).then((res) => {
      // store에 저장
      setPostObject((prev) => {
        return {
          ...prev,
          postId: res.postId,
          userId: res.userId,
          postTitle: res.postTitle,
          postCategory: res.postCategory,
          postContent: res.postContent,
          audioUrl: res.audioUrl,
          thumbnailUrl: res.thumbnailUrl,
          postSummary: res.postSummary,
          isDeleted: res.isDeleted,
          createdAt: res.createdAt,
          updatedAt: res.updatedAt,
        };
      });

      // dispatch({
      //   type: "UPDATE_INFO",
      //   payload: {
      //     userId: res.userId,
      //     postId: res.postId,
      //   },
      // });
    });
  }, [postId]);

  const togglePlay = () => {
    if (onPlay) {
      audioRef.current.pause(); // 오디오 일시정지
    } else {
      audioRef.current.play(); // 오디오 재생
    }
    setOnPlay(!onPlay);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const userId = window.localStorage.getItem("userId");
  console.log("유저 아이디입니다 : ", userId);
  const token = getCookie("accessToken");

  const onAddToPlaylist = async (userId, postId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/api/playlists/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
          },
          params: {
            postId: postId,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const data = response.data;
        alert("플레이리스트에 추가되었습니다!");
        console.log("추가된 플레이리스트: ", data);
      } else {
        console.error("플레이리스트 추가 중 오류 발생");
        alert("플레이리스트 추가 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("에러 발생: ", error);
      alert("플레이리스트 추가 중 에러가 발생했습니다.");
    }
  };

  return (
    <>
      <S.PostHeader>
        <S.IconWrapper>
          <div onClick={togglePlay}>
            {onPlay ? <S.PauseIcon /> : <S.PlayIcon />}
          </div>
          <S.AddIcon onClick={() => onAddToPlaylist(userId, postId)} />
        </S.IconWrapper>
        <S.PostCategory>{postObject.postCategory}</S.PostCategory>
      </S.PostHeader>
      <S.PostTitle>{postObject.postTitle}</S.PostTitle>
      <S.PostMeta>{postdate.toLocaleString()}</S.PostMeta>
      <S.PostContent>
        <S.PostContentHeader>
          <S.Thumbnail src={postObject.thumbnailUrl} alt="Post Thumbnail" />
          <S.SummaryWrap>
            <S.SummaryTitle>요 약</S.SummaryTitle>
            <S.Summary>{postObject.postSummary}</S.Summary>
          </S.SummaryWrap>
        </S.PostContentHeader>
        {/* <S.TextPlaceholder>{postObject.postContent}</S.TextPlaceholder> */}
        <S.TextPlaceholder
          dangerouslySetInnerHTML={{ __html: postObject.postContent }}
        />
      </S.PostContent>

      {/* 오디오 요소 추가 */}
      {postObject.audioUrl && (
        <audio ref={audioRef} src={postObject.audioUrl} />
      )}

      <S.PostButtonWrap>
        <S.Btn onClick={handleEdit}>수정</S.Btn>
        <S.Btn onClick={handleDelete}>삭제</S.Btn>
      </S.PostButtonWrap>
    </>
  );
}

export default PostView;
