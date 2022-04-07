import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { resourceListAction } from "../actions/resourceAction";
import { LoadingOverlay, NativeSelect } from "@mantine/core";
import { Check, Hash, X } from "tabler-icons-react";
import { ResourceList } from "../components/ResourceList";
import { usePrevious } from "../hooks/usePrevious";
import { showNotification } from "@mantine/notifications";

const Resource = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const courseNames = useSelector(state => state.courseNames);
  const { courseInfo } = courseNames;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login", { replace: true });
    }

    if (userInfo && !courseInfo) {
      navigate("/", { replace: true });
    }
  }, [courseInfo, navigate, userInfo]);

  const [course, setCourse] = useState(courseInfo[0].id);
  const prevCourse = usePrevious(course);

  const resourceList = useSelector(state => state.resourceList);
  const { loading, error, resources } = resourceList;

  useEffect(() => {
    if (course.length !== 0 && prevCourse !== course)
      dispatch(resourceListAction(course));
  }, [course, dispatch, prevCourse]);

  const resourceDelete = useSelector(state => state.resourceDelete);
  const { success: successRemove } = resourceDelete;

  useEffect(() => {
    if (successRemove) {
      showNotification({
        autoClose: 4000,
        title: "Happy",
        message: "Resource has been removed successfully",
        color: "green",
        icon: <Check />,
      });
      dispatch(resourceListAction(course));
    }

    error &&
      showNotification({
        autoClose: 4000,
        title: "Sad",
        message: "Resource cannot be deleted",
        color: "red",
        icon: <X />,
      });
  }, [course, dispatch, error, successRemove]);

  const data = courseInfo.map(v => ({
    value: v.id,
    label: v.courseName,
  }));

  return (
    <>
      <Wrapper>
        <Header>
          <Title>Resources</Title>
          <NativeSelect
            label="Select your enrolled Course"
            placeholder="Select a course"
            data={data}
            value={course}
            onChange={e => setCourse(e.currentTarget.value)}
            icon={<Hash size={14} />}
          />
        </Header>
        {loading && resources.length === 0 && <LoadingOverlay visible={true} />}
        <Container>
          {resources.length !== 0 && (
            <ResourceList
              key={resources}
              data={resources}
              staff={userInfo?.studentID ? null : userInfo.email}
            />
          )}
        </Container>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center
  height: 100vh;
  width: 100%;
  padding: 120px;
  position: relative;
`;
const Header = styled.div`
  flex: 0.16;
`;
const Title = styled.h1``;
const Container = styled.div`
  flex: 0.84;

  background-color: f1f1f1;
`;

export default Resource;
