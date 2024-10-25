import { useNavigate, useParams } from "react-router-dom";
import * as S from "../../../styles/mypage/PostView.style";
import { useEffect, useReducer, useRef, useState } from "react";
import { POST_READ, POST_REMOVE } from "../../../api/post";

function PostView() {
  const navigate = useNavigate();
  const { postId } = useParams();
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

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
  const userId = window.localStorage.getItem("userId");
  console.log("유저 아이디입니다 : ", userId);

  const onAddToPlaylist = async (userId, postId) => {
    try {
      const response = await fetch(`/api/playlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          postId: postId,
          // 필요시 playListDto에 추가 정보를 보낼 수 있음
        }),
      });

      if (response.ok) {
        const data = await response.json();
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
