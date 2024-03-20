import { gql, useMutation, useQuery } from "@apollo/client";

// apollo 용 Query 만들기
const GET_TODO = gql`
  query {
    todos {
      title
      weather
      id
      date
      complete
    }
  }
`;
// 쉽게 사용하시라고 함수형도 제공합니다.
const GET_TODO_FN = gql`
  query todos {
    title
    weather
    id
    date
    complete
  }
`;

// 삭제하기 Mutation 활용
// gql 는 $ 변수로 인식
const DELETE_TODO = gql`
  mutation deleteTodo($id: Int) {
    # 실제로 전달할 변수를 작성하는 곳
    deleteTodo(id: $id) {
      id
    }
  }
`;

// 수정하기 Mutation 활용
// gql 는 $ 변수로 인식
const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Int!, $title: String!) {
    updateTodo(id: $id, title: $title) {
      title
      weather
      id
      date
      complete
    }
  }
`;

// 추가하기 Mutation 활용
// gql 는 $ 변수로 인식
const ADD_TODO = gql`
  mutation AddTodo {
    addTodo(
      id: 100
      title: "추가에요"
      date: "2023-03-20"
      complete: false
      weather: 5
    ) {
      title
      weather
      id
      date
      complete
    }
  }
`;

export const List = () => {
  // apollo useQuery(쿼리)
  const { loading, data, error } = useQuery(GET_TODO);

  // apollo useMutation(Mutation)
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const [addTodo] = useMutation(ADD_TODO);
  if (loading) {
    return <h2>로딩중이에요.</h2>;
  }
  if (error) {
    return <h2>에러가 발생했습니다..</h2>;
  }
  //   console.log(data.todos);
  const handleDelete = async (_id) => {
    console.log("삭제");
    // 눈여겨보세요.
    const result = await deleteTodo({
      // variables ====> $ 로 전달할 값;
      variables: { id: _id },
      // 실행 후 실행할 다시 전체 자료 호출 쿼리
      refetchQueries: [{ query: GET_TODO }],
    });
    console.log(result);
  };

  // 업데이트 하기
  const handleUpdate = async (_id) => {
    console.log("수정");
    // 눈여겨보세요.
    const result = await updateTodo({
      // variables ====> $ 로 전달할 값;
      variables: { id: _id, title: "수정했지롱" },
      // 실행 후 실행할 다시 전체 자료 호출 쿼리
      refetchQueries: [{ query: GET_TODO }],
    });
    console.log(result);
  };

  // 업데이트 하기
  const handleAdd = async () => {
    console.log("추가");
    const result = await addTodo({
      // variables ====> $ 로 전달할 값;
      variables: {},
      // 실행 후 실행할 다시 전체 자료 호출 쿼리
      refetchQueries: [{ query: GET_TODO }],
    });
    console.log(result);
  };

  return (
    <div>
      <h1>Todo 목록</h1>
      <hr />
      <button
        onClick={() => {
          handleAdd();
        }}
      >
        추가하기
      </button>
      <ul>
        {
          /* gpl 연동 출력 */
          data.todos.map((item) => {
            return (
              <li key={item.id}>
                <h2>{item.title}</h2>
                <div>
                  {item.weather}
                  <button
                    onClick={() => {
                      handleUpdate(item.id);
                    }}
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(item.id);
                    }}
                  >
                    삭제하기
                  </button>
                  {item.date}
                </div>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};
