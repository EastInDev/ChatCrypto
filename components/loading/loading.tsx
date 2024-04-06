// LoadingComponent.js
import React from "react";
import { ScaleLoader } from "react-spinners";

const LoadingComponent = ({
  height = "160px",
  width = "32px",
  color = "#ff9900",
  radius = "8px",
  center = false, // 중앙 정렬 여부를 결정하는 새로운 prop 추가
}) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: center ? "100vh" : "100%", // center가 true이면 뷰포트 높이(100vh)로 설정
      width: "100%",
      position: center ? "fixed" : "static", // center가 true이면 위치를 고정
      top: 0, // 고정 위치 시작점
      left: 0, // 고정 위치 시작점
    }}
  >
    <ScaleLoader height={height} width={width} color={color} radius={radius} />
  </div>
);

export default LoadingComponent;
