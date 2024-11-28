declare namespace API {
  type AiRequest = {
    md?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseCommentVO_ = {
    code?: number;
    data?: CommentVO;
    message?: string;
  };

  type BaseResponseFavoriteVO_ = {
    code?: number;
    data?: FavoriteVO;
    message?: string;
  };

  type BaseResponseInterviewRecordDetailVO_ = {
    code?: number;
    data?: InterviewRecordDetailVO;
    message?: string;
  };

  type BaseResponseInterviewRecordVO_ = {
    code?: number;
    data?: InterviewRecordVO;
    message?: string;
  };

  type BaseResponseListInt_ = {
    code?: number;
    data?: number[];
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseMessageVO_ = {
    code?: number;
    data?: MessageVO;
    message?: string;
  };

  type BaseResponsePageComment_ = {
    code?: number;
    data?: PageComment_;
    message?: string;
  };

  type BaseResponsePageCommentVO_ = {
    code?: number;
    data?: PageCommentVO_;
    message?: string;
  };

  type BaseResponsePageFavorite_ = {
    code?: number;
    data?: PageFavorite_;
    message?: string;
  };

  type BaseResponsePageFavoriteVO_ = {
    code?: number;
    data?: PageFavoriteVO_;
    message?: string;
  };

  type BaseResponsePageInterviewRecord_ = {
    code?: number;
    data?: PageInterviewRecord_;
    message?: string;
  };

  type BaseResponsePageInterviewRecordDetail_ = {
    code?: number;
    data?: PageInterviewRecordDetail_;
    message?: string;
  };

  type BaseResponsePageInterviewRecordDetailVO_ = {
    code?: number;
    data?: PageInterviewRecordDetailVO_;
    message?: string;
  };

  type BaseResponsePageInterviewRecordVO_ = {
    code?: number;
    data?: PageInterviewRecordVO_;
    message?: string;
  };

  type BaseResponsePageMessage_ = {
    code?: number;
    data?: PageMessage_;
    message?: string;
  };

  type BaseResponsePageMessageVO_ = {
    code?: number;
    data?: PageMessageVO_;
    message?: string;
  };

  type BaseResponsePageQuestion_ = {
    code?: number;
    data?: PageQuestion_;
    message?: string;
  };

  type BaseResponsePageQuestionBank_ = {
    code?: number;
    data?: PageQuestionBank_;
    message?: string;
  };

  type BaseResponsePageQuestionBankQuestion_ = {
    code?: number;
    data?: PageQuestionBankQuestion_;
    message?: string;
  };

  type BaseResponsePageQuestionBankQuestionVO_ = {
    code?: number;
    data?: PageQuestionBankQuestionVO_;
    message?: string;
  };

  type BaseResponsePageQuestionBankVO_ = {
    code?: number;
    data?: PageQuestionBankVO_;
    message?: string;
  };

  type BaseResponsePageQuestionVO_ = {
    code?: number;
    data?: PageQuestionVO_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponseQuestionBankQuestionVO_ = {
    code?: number;
    data?: QuestionBankQuestionVO;
    message?: string;
  };

  type BaseResponseQuestionBankVO_ = {
    code?: number;
    data?: QuestionBankVO;
    message?: string;
  };

  type BaseResponseQuestionVO_ = {
    code?: number;
    data?: QuestionVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type checkUsingGETParams = {
    /** echostr */
    echostr?: string;
    /** nonce */
    nonce?: string;
    /** signature */
    signature?: string;
    /** timestamp */
    timestamp?: string;
  };

  type Comment = {
    content?: string;
    createTime?: string;
    id?: number;
    isDelete?: number;
    parentId?: number;
    questionId?: number;
    updateTime?: string;
    userId?: number;
  };

  type CommentAddRequest = {
    content?: string;
    parentId?: number;
    questionId?: number;
  };

  type CommentQueryRequest = {
    content?: string;
    createTime?: string;
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    questionId?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type CommentUpdateRequest = {
    content?: string;
    id?: number;
    parentId?: number;
    questionId?: number;
    userId?: number;
  };

  type CommentVO = {
    content?: string;
    createTime?: string;
    id?: number;
    parentId?: number;
    questionId?: number;
    userId?: number;
  };

  type CrawlerRequest = {
    name?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type doLoginUsingDELETEParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type doLoginUsingGETParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type doLoginUsingPATCHParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type doLoginUsingPOSTParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type doLoginUsingPUTParams = {
    /** password */
    password?: string;
    /** username */
    username?: string;
  };

  type Favorite = {
    createTime?: string;
    favoriteType?: number;
    id?: number;
    questionId?: number;
    userId?: number;
  };

  type FavoriteAddRequest = {
    favoriteType?: number;
    questionId?: number;
    userId?: number;
  };

  type FavoriteQueryRequest = {
    current?: number;
    favoriteType?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    questionId?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type FavoriteUpdateRequest = {
    favoriteType?: number;
    id?: number;
  };

  type FavoriteVO = {
    createTime?: string;
    favoriteType?: number;
    id?: number;
    questionId?: number;
    userId?: number;
  };

  type getCommentVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getFavoriteVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getInterviewRecordDetailVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getInterviewRecordVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getMessageVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionBankQuestionVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getQuestionBankVOByIdUsingGETParams = {
    current?: number;
    description?: string;
    id?: number;
    needQueryQuestionList?: boolean;
    notId?: number;
    pageSize?: number;
    picture?: string;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    userId?: number;
  };

  type getQuestionVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserSignInRecordUsingGETParams = {
    /** year */
    year?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type InterviewRecord = {
    aiReport?: Record<string, any>;
    createTime?: string;
    duration?: number;
    id?: number;
    isDelete?: number;
    status?: number;
    totalQuestions?: number;
    updateTime?: string;
    userId?: number;
  };

  type InterviewRecordAddRequest = {
    totalQuestions?: number;
    userId?: number;
  };

  type InterviewRecordDetail = {
    answer?: string;
    createTime?: string;
    id?: number;
    interviewRecordId?: number;
    questionId?: number;
    timeTaken?: number;
  };

  type InterviewRecordDetailAddRequest = {
    interviewRecordId?: number;
    questionId?: number;
  };

  type InterviewRecordDetailEditRequest = {
    answer?: string;
    id?: number;
    interviewRecordId?: number;
    questionId?: number;
    timeTaken?: number;
  };

  type InterviewRecordDetailQueryRequest = {
    answer?: string;
    createTime?: string;
    current?: number;
    id?: number;
    interviewRecordId?: number;
    notId?: number;
    pageSize?: number;
    questionId?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type InterviewRecordDetailUpdateRequest = {
    answer?: string;
    id?: number;
    interviewRecordId?: number;
    questionId?: number;
    timeTaken?: number;
  };

  type InterviewRecordDetailVO = {
    answer?: string;
    createTime?: string;
    id?: number;
    interviewRecordId?: number;
    questionId?: number;
    timeTaken?: number;
  };

  type InterviewRecordQueryRequest = {
    createTime?: string;
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    status?: number;
    userId?: number;
  };

  type InterviewRecordUpdateRequest = {
    aiReport?: Record<string, any>;
    duration?: number;
    id?: number;
    status?: number;
    totalQuestions?: number;
    updateTime?: string;
    userId?: number;
  };

  type InterviewRecordVO = {
    createTime?: string;
    duration?: number;
    id?: number;
    status?: number;
    totalQuestions?: number;
    userId?: number;
  };

  type LoginUserVO = {
    createTime?: string;
    id?: number;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type Message = {
    content?: string;
    createTime?: string;
    id?: number;
    isRead?: number;
    type?: Record<string, any>;
    userId?: number;
  };

  type MessageAddRequest = {
    content?: string;
    createTime?: string;
    id?: number;
    isRead?: number;
    type?: Record<string, any>;
    userId?: number;
  };

  type MessageEditRequest = {
    content?: string;
    createTime?: string;
    id?: number;
    isRead?: number;
    type?: Record<string, any>;
    userId?: number;
  };

  type MessageQueryRequest = {
    content?: string;
    createTime?: string;
    current?: number;
    id?: number;
    isRead?: number;
    notId?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    type?: Record<string, any>;
    userId?: number;
  };

  type MessageUpdateRequest = {
    content?: string;
    createTime?: string;
    id?: number;
    isRead?: number;
    type?: Record<string, any>;
    userId?: number;
  };

  type MessageVO = {
    createTime?: string;
    id?: number;
    isRead?: number;
    type?: Record<string, any>;
    userId?: number;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageComment_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Comment[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageCommentVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: CommentVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageFavorite_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Favorite[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageFavoriteVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: FavoriteVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageInterviewRecord_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: InterviewRecord[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageInterviewRecordDetail_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: InterviewRecordDetail[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageInterviewRecordDetailVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: InterviewRecordDetailVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageInterviewRecordVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: InterviewRecordVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageMessage_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Message[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageMessageVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: MessageVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestion_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Question[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionBank_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionBank[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionBankQuestion_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionBankQuestion[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionBankQuestionVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionBankQuestionVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionBankVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionBankVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageQuestionVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: QuestionVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Question = {
    answer?: string;
    content?: string;
    createTime?: string;
    editTime?: string;
    id?: number;
    isDelete?: number;
    tags?: string;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type QuestionAddRequest = {
    answer?: string;
    content?: string;
    tags?: string[];
    title?: string;
  };

  type QuestionBank = {
    createTime?: string;
    description?: string;
    editTime?: string;
    id?: number;
    isDelete?: number;
    picture?: string;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type QuestionBankAddRequest = {
    description?: string;
    picture?: string;
    title?: string;
  };

  type QuestionBankEditRequest = {
    description?: string;
    id?: number;
    picture?: string;
    title?: string;
  };

  type QuestionBankQueryRequest = {
    current?: number;
    description?: string;
    id?: number;
    needQueryQuestionList?: boolean;
    notId?: number;
    pageSize?: number;
    picture?: string;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    title?: string;
    userId?: number;
  };

  type QuestionBankQuestion = {
    createTime?: string;
    id?: number;
    questionBankId?: number;
    questionId?: number;
    updateTime?: string;
    userId?: number;
  };

  type QuestionBankQuestionAddRequest = {
    questionBankId?: number;
    questionId?: number;
  };

  type QuestionBankQuestionBatchAddRequest = {
    questionBankId?: number;
    questionIdList?: number[];
  };

  type QuestionBankQuestionBatchRemoveRequest = {
    questionBankId?: number;
    questionIdList?: number[];
  };

  type QuestionBankQuestionQueryRequest = {
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    questionBankId?: number;
    questionId?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type QuestionBankQuestionRemoveRequest = {
    questionBankId?: number;
    questionId?: number;
  };

  type QuestionBankQuestionUpdateRequest = {
    id?: number;
    questionBankId?: number;
    questionId?: number;
  };

  type QuestionBankQuestionVO = {
    createTime?: string;
    id?: number;
    questionBankId?: number;
    questionId?: number;
    tagList?: string[];
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type QuestionBankUpdateRequest = {
    description?: string;
    id?: number;
    picture?: string;
    title?: string;
  };

  type QuestionBankVO = {
    createTime?: string;
    description?: string;
    id?: number;
    picture?: string;
    questionPage?: PageQuestionVO_;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type QuestionBatchDeleteRequest = {
    questionIdList?: number[];
  };

  type QuestionEditRequest = {
    answer?: string;
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type QuestionQueryRequest = {
    answer?: string;
    content?: string;
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    questionBankId?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type QuestionUpdateRequest = {
    answer?: string;
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type QuestionVO = {
    answer?: string;
    content?: string;
    createTime?: string;
    id?: number;
    tagList?: string[];
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    editTime?: string;
    id?: number;
    isDelete?: number;
    mpOpenId?: string;
    unionId?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type userLoginByWxOpenUsingGETParams = {
    /** code */
    code: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
