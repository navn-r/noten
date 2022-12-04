import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { Accordion, InfoGrid, Page } from '../../components';
import { useModalData as _useModalData, useService } from '../../hooks';
import { useModalData } from '../../hooks/NewUseModalData';
import { CategoryModal, CategoryModalData } from './CategoryModal';
import { CourseModal, CourseModalData } from './CourseModal/CourseModal';

const Dashboard: React.FC = () => {
  const service = useService();
  const history = useHistory();
  // const [showCategoryModal, setShowCategoryModal] = useState(false);

  const {
    data: courseModalData,
    setData: setCourseModalData,
    showModal: showCourseModal,
    openModal: openCourseModal,
    closeModal: closeCourseModal,
  } = useModalData<CourseModalData>({
    name: '',
    instructor: '',
    passFail: false,
  });

  // const {
  //   data: categoryModalData,
  //   setData: setCategoryModalData,
  //   reset: resetCategoryModalData,
  // } = _useModalData<CategoryModalData>({
  //   id: '',
  //   categories: [],
  // });

  const semester = service.getSemester();

  // const resetCourseModal = () => {
  //   resetCourseModalData();
  //   setShowCourseModal(false);
  // };

  // const resetCategoryModal = () => {
  //   // Don't clear modal data when modifying categories.
  //   if (!categoryModalData.id) {
  //     resetCategoryModalData();
  //   }
  //   setShowCategoryModal(false);
  // };

  // const deleteCourse = async (key: Noten.UID) => {
  //   await service.deleteCourse(key);
  //   resetCategoryModal();
  //   resetCourseModal();
  // };

  const openCourse = (id: string) => {
    history.push(`/home/dashboard/course/${id}`);
  };

  // const onCourseSuccess = async () => {
  //   if (courseModalData.id) {
  //     // If categories were modified, update via service here
  //     await service.editCourse(
  //       courseModalData.id,
  //       courseModalData,
  //       categoryModalData.id
  //         ? categoryModalData.categories.map(_parseCategory)
  //         : undefined
  //     );
  //     resetCategoryModal();
  //     resetCourseModal();
  //   } else {
  //     // New course means no id
  //     openCategoryModal('');
  //   }
  // };

  // const onCategorySuccess = async () => {
  //   if (categoryModalData.id) {
  //     // Do not reset the category data
  //     setShowCategoryModal(false);
  //   } else {
  //     await service.createCourse(
  //       {
  //         instructor: courseModalData.instructor.trim(),
  //         name: courseModalData.name.trim(),
  //         passFail: courseModalData.passFail,
  //       },
  //       categoryModalData.categories.map(_parseCategory)
  //     );
  //     resetCategoryModal();
  //     resetCourseModal();
  //   }
  // };

  // const openCourseModal = async (data?: CourseModalData) => {
  //   setShowCourseModal(true);

  //   // FIXME: Temporary workaround for course modal to appear
  //   // Remove once modal forms are consolidated
  //   if (data) {
  //     setTimeout(() => setCourseModalData({ ...data }), 1000);
  //   }
  // };

  // const openCategoryModal = (id: Noten.UID) => {
  //   setCategoryModalData({
  //     id,
  //     categories:
  //       id.length > 0
  //         ? service.getCategories(id).map(([k, c]) => ({ ...c, id: k }))
  //         : [],
  //   });
  //   setShowCategoryModal(true);
  // };

  // TODO: REMOVE
  const categoryModalData = { id: '', categories: [] };

  const _parseCategory = (
    category: CategoryModalData['categories'][0]
  ): Omit<Noten.ICategory, 'courseKey' | 'numGrades'> & {
    id: Noten.UID;
  } => ({
    id: category.id,
    name: category.name.trim(),
    weight: +category.weight,
  });

  const onCourseSuccess = async (
    showCategoryModal: boolean,
    modalData: CourseModalData
  ) => {
    const { id, name, instructor, passFail } = courseModalData;
    const { id: courseKey, categories } = categoryModalData;

    /**
     * 1. New Course -> Jump to Category Modal
     * 2. Edit Course -> Modify Categories button
     *                -> Fetch categories from service
     *                -> Jump to Category Modal
     */
    if (showCategoryModal) {
      const categories = id
        ? service.getCategories(id).map(([k, c]) => ({ ...c, id: k }))
        : [];

      setCourseModalData({ id, ...modalData });
      console.table({ id, categories, ...modalData });
      // openCategoryModal({ id, categories });
      return;
    }

    // 3. Edit Course -> Categories may be modified
    //                -> Course Modal Success Button
    if (id) {
      await service.editCourse(
        id,
        { name, instructor: instructor ?? '', passFail },
        // Don't update categories if not necessary
        courseKey ? categories.map(_parseCategory) : undefined
      );

      closeCourseModal(true);
      // closeCategoryModal(true);
    }
  };

  return (
    <Page>
      <Page.Title
        title={semester?.name ?? 'No semesters were found.'}
        subtitle={
          semester
            ? semester.numCourses > 0
              ? 'Tap to open. Long press to modify.'
              : 'Press to create a new course.'
            : 'Press to create a new semester.'
        }
        addNewHandler={() =>
          semester
            ? openCourseModal()
            : history.replace('/settings/configure-semesters?new=true')
        }
      />
      <InfoGrid
        data={{
          cGPA: service.getCGPA(),
          Average: service.getAverage(service.getSemesterKey()),
          GPA: service.getGPA(service.getSemesterKey()),
        }}
      />
      {!semester?.courses?.length && <Page.Empty />}
      <div>
        {semester?.courses?.map(([id, { name, instructor, passFail }]) => (
          <Accordion
            key={id}
            onPress={() => openCourse(id)}
            isPassFail={passFail}
            title={name}
            onLongPress={() => {
              openCourseModal();
              // FIXME Temporary??? HELP
              setTimeout(() => {
                setCourseModalData({ id, name, instructor, passFail });
              }, 550);
            }}
            shouldMerge
            color="tertiary-shade"
          >
            <InfoGrid
              color="tertiary-tint"
              data={{
                Grade: service.getGrade(id),
                Average: service.getAverage(id),
                GPA: service.getGPA(id),
              }}
            />
          </Accordion>
        ))}
      </div>
      {semester && (
        <>
          <CourseModal
            data={courseModalData}
            showModal={showCourseModal}
            onDismiss={() => closeCourseModal(true)}
            onSuccess={onCourseSuccess}
          />
          {/* <CategoryModal
            showModal={showCategoryModal}
            onDismiss={resetCategoryModal}
            onSuccess={onCategorySuccess}
            data={categoryModalData}
            setData={setCategoryModalData}
          /> */}
        </>
      )}
    </Page>
  );
};

export default Dashboard;
