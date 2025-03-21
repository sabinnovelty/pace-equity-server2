import { AnyObj, IPaginationQuery } from '../../../shared/types';
import {
  parsePagination,
  resolvePaginationOptions,
  resolvePaginationOptionsWithMetadata,
} from '../util';

export function buildPaginationPipelineStages(
  options: IPaginationQuery & { shouldSort?: boolean },
  stagesAfterPagination: any[] = []
) {
  const { skip, limit, order } = resolvePaginationOptions(options);

  const pipeline: AnyObj[] = [];

  if (options.shouldSort) {
    pipeline.push({
      $sort: order,
    });
  }

  pipeline.push({
    $skip: skip,
  });

  pipeline.push({
    $limit: limit,
  });

  pipeline.push(...stagesAfterPagination);

  return pipeline;
}

export function buildPaginationPipelineStagesWithMetadata(
  options: IPaginationQuery,
  stagesAfterPagination: any[] = []
) {
  const { page } = parsePagination(options.page);
  const {
    paginationQuery: { skip, limit, order },
  } = resolvePaginationOptionsWithMetadata(0, options);

  const pipeline = [
    {
      $facet: {
        paginatedData: [
          {
            $sort: order,
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ].concat(stagesAfterPagination),
        countData: [
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              count: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$countData',
      },
    },
    {
      $project: {
        rows: '$paginatedData',
        count: '$countData.count',
        currentPage: { $literal: page },
        hasPreviousPage: {
          $gt: [page, 1],
        },
        totalPage: {
          $ceil: {
            $divide: ['$countData.count', limit],
          },
        },
      },
    },
    {
      $project: {
        rows: 1,
        count: 1,
        metaInfo: {
          totalPage: '$totalPage',
          currentPage: '$currentPage',
          hasPreviousPage: '$hasPreviousPage',
          hasNextPage: {
            $gt: ['$totalPage', page],
          },
        },
      },
    },
  ];

  return pipeline;
}
