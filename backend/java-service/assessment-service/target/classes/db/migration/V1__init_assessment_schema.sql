create table if not exists question_pool (
   id         bigserial primary key,
   name       varchar(255) not null,
   difficulty varchar(20),
   is_public  boolean default true,
   created_at timestamptz default now()
);

create table if not exists question (
   id        bigserial primary key,
   pool_id   bigint
      references question_pool ( id )
         on delete cascade,
   type      varchar(20) not null,
   metadata  jsonb,
   weight    double precision default 1.0,
   skill_tag varchar(100)
);

create table if not exists rubric (
   id          bigserial primary key,
   question_id bigint
      references question ( id )
         on delete cascade,
   name        varchar(255)
);

create table if not exists rubric_item (
   id          bigserial primary key,
   rubric_id   bigint
      references rubric ( id )
         on delete cascade,
   criterion   varchar(255),
   max_points  int,
   description text
);

create table if not exists exam_config (
   id                   bigserial primary key,
   title                varchar(255) not null,
   policy               varchar(30),
   browser_lock_enabled boolean default false,
   time_limit_minutes   int,
   lesson_id            bigint,
   created_at           timestamptz default now()
);

create table if not exists exam_section_rule (
   id                  bigserial primary key,
   config_id           bigint
      references exam_config ( id )
         on delete cascade,
   pool_id             bigint
      references question_pool ( id )
         on delete cascade,
   count_to_pull       int not null,
   points_per_question int
);

create table if not exists attempt (
   id             bigserial primary key,
   student_id     uuid not null,
   exam_config_id bigint
      references exam_config ( id )
         on delete cascade,
   status         varchar(30) not null,
   started_at     timestamptz,
   submitted_at   timestamptz
);

create table if not exists answer (
   id                   bigserial primary key,
   attempt_id           bigint
      references attempt ( id )
         on delete cascade,
   question_id          bigint
      references question ( id )
         on delete cascade,
   response             jsonb,
   score                double precision,
   feedback             jsonb,
   manual_review_needed boolean default false
);

create table if not exists gradebook (
   id          bigserial primary key,
   student_id  uuid not null,
   course_id   bigint,
   exam_id     bigint
      references exam_config ( id )
         on delete set null,
   final_score double precision,
   grade       varchar(10),
   status      varchar(20),
   graded_at   timestamptz default now()
);

create index if not exists idx_attempt_student on
   attempt (
      student_id
   );
create index if not exists idx_gradebook_course on
   gradebook (
      course_id
   );