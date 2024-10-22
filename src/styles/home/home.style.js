import styled from "styled-components";

export const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const Title = styled.h1`
  margin: 20px 0 10px;
  font-size: 35px;
  font-weight: 500;
  color: var(--navy);
`;

export const ImgClock = styled.img`
  margin-top: 50px;
  width: 350px;
  margin-bottom: 20px;
`;

export const Subtitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: var(--navy);
  margin-bottom: 80px;
`;
export const CategorySection = styled.div`
  display: flex;
  gap: 20px;
  align-self: flex-start;
  margin-bottom: 40px;
`;
export const CategoryButton = styled.button`
  border-radius: 16px;
  box-shadow: 8px 8px 20px rgba(174, 174, 192, 0.4),
    -8px -8px 20px rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  background-color: var(--light-gray);
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: 400;
  color: var(--navy);

  &:hover {
    box-shadow: 10px 10px 10px rgba(174, 174, 192, 0.5) inset;
  }
`;

export const PostListContainer = styled.div`
  /* display: flex;
  flex-direction: column; */
`;
